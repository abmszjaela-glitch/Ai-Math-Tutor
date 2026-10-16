const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../config/prisma');
const { getLessons, publicQuestion, gradeAnswers } = require('../data/practiceBank');
const startSchema = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('practice'), lessonId: z.string().max(100) }),
  z.object({ mode: z.literal('mock'), count: z.union([z.literal(12), z.literal(20)]) }),
]);
const submitSchema = z.object({ token: z.string().max(20000), answers: z.record(z.string().max(150), z.string().max(80)).refine((v) => Object.keys(v).length <= 48) });
// Coalesce duplicate submissions (including browser retries) for this server instance.
const submissions = new Map();
const VERSION = 1;
const studentFor = (userId) => prisma.student.findUnique({ where: { userId }, include: { grade: true } });
function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}
const catalog = async (req, res) => {
  const student = await studentFor(req.userId);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  const progress = await prisma.studentProgress.findMany({ where: { studentId: student.id }, select: { lessonId: true, score: true, completed: true, attempts: true } });
  const lessons = getLessons(student.grade.number).map(({ questions, ...lesson }) => ({ ...lesson, questionCount: questions.length, progress: progress.find((item) => item.lessonId === `${student.gradeId}-practice-${lesson.slug}`) || null }));
  return res.json({ success: true, student: { id: student.id, name: student.name, grade: student.grade.number }, lessons });
};
const start = async (req, res) => {
  const input = startSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, message: 'Choose a lesson or a valid mock test length' });
  const student = await studentFor(req.userId);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  const lessons = getLessons(student.grade.number);
  const { mode } = input.data;
  let questions, title;
  if (mode === 'practice') {
    const lesson = lessons.find((item) => item.id === input.data.lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found for your grade' });
    questions = shuffle(lesson.questions); title = lesson.title;
  } else {
    // Equal representation from all four subjects, with fresh selection and order each time.
    const subjects = [...new Set(lessons.map((lesson) => lesson.subject))];
    questions = shuffle(subjects.flatMap((subject) => shuffle(lessons.filter((l) => l.subject === subject).flatMap((l) => l.questions)).slice(0, input.data.count / subjects.length)));
    title = `Grade ${student.grade.number} · Mixed mathematics`;
  }
  const startedAt = Date.now();
  const durationSeconds = mode === 'mock' ? questions.length * 60 : null;
  const deadline = durationSeconds ? startedAt + durationSeconds * 1000 : null;
  const token = jwt.sign({ version: VERSION, userId: req.userId, grade: student.grade.number, ids: questions.map((q) => q.id), mode, startedAt, deadline, attemptId: crypto.randomUUID() }, process.env.JWT_SECRET, { audience: 'math-practice', expiresIn: '2h', algorithm: 'HS256' });
  return res.status(201).json({ success: true, attempt: { token, title, mode, startedAt, deadline, durationSeconds, serverNow: startedAt, expiresAt: startedAt + 7200000, questions: questions.map(publicQuestion) } });
};
async function saveResult(student, lessons, result) {
  // Reuse the existing curriculum/progress tables. No destructive schema migration is needed.
  const grouped = new Map();
  for (const review of result.reviews) {
    if (!grouped.has(review.lessonId)) grouped.set(review.lessonId, []);
    grouped.get(review.lessonId).push(review);
  }
  await prisma.$transaction(async (tx) => {
    for (const [lessonId, reviews] of grouped) {
      const lesson = lessons.find((item) => item.id === lessonId);
      const topic = await tx.topic.upsert({
        where: { id: `${student.gradeId}-${lesson.subject}` },
        update: {}, create: { id: `${student.gradeId}-${lesson.subject}`, gradeId: student.gradeId, name: lesson.subject, description: `${lesson.subject} for Grade ${student.grade.number}` },
      });
      const dbLesson = await tx.lesson.upsert({
        where: { id: `${student.gradeId}-practice-${lesson.slug}` },
        update: { title: lesson.title, description: lesson.summary },
        create: { id: `${student.gradeId}-practice-${lesson.slug}`, topicId: topic.id, title: lesson.title, description: lesson.summary, order: 100 + lessons.indexOf(lesson) },
      });
      const score = Math.round(reviews.filter((r) => r.correct).length / reviews.length * 100);
      const mastered = result.mode === "practice" && reviews.length === lesson.questions.length && score >= 70;
      const where = { studentId: student.id, lessonId: dbLesson.id };
      await tx.studentProgress.upsert({
        where: { studentId_lessonId: where },
        create: { ...where, score, completed: mastered, attempts: 1 },
        update: { attempts: { increment: 1 } },
      });
      // Conditional SQL updates keep a lower concurrent submission from replacing a best score.
      await tx.studentProgress.updateMany({ where: { ...where, OR: [{ score: null }, { score: { lt: score } }] }, data: { score } });
      if (mastered) await tx.studentProgress.updateMany({ where: { ...where, completed: false }, data: { completed: true } });
    }
  });
}
const submit = async (req, res) => {
  const input = submitSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, message: 'Invalid test submission' });
  let claims;
  try { claims = jwt.verify(input.data.token, process.env.JWT_SECRET, { audience: 'math-practice', algorithms: ['HS256'] }); }
  catch { return res.status(401).json({ success: false, code: 'ATTEMPT_EXPIRED', message: 'This test session expired. Please start a new one.' }); }
  if (claims.userId !== req.userId || claims.version !== VERSION || !Array.isArray(claims.ids)) return res.status(403).json({ success: false, message: 'This test belongs to a different session' });
  const student = await studentFor(req.userId);
  if (!student || student.grade.number !== claims.grade) return res.status(403).json({ success: false, message: 'Your grade changed. Please start a new test.' });
  for (const [key, entry] of submissions) if (entry.expiresAt < Date.now()) submissions.delete(key);
  const key = claims.attemptId;
  if (submissions.has(key)) return res.json({ success: true, result: await submissions.get(key).promise });
  if (claims.deadline && Date.now() > claims.deadline + 30000) return res.status(410).json({ success: false, message: 'The mock test deadline has passed. Start a new test to try again.' });
  if (submissions.size >= 2000) return res.status(503).json({ success: false, message: 'Please try submitting again shortly.' });
  const lessons = getLessons(claims.grade);
  const bank = new Map(lessons.flatMap((l) => l.questions).map((q) => [q.id, q]));
  const questions = claims.ids.map((id) => bank.get(id));
  if (!questions.length || questions.some((q) => !q) || new Set(claims.ids).size !== questions.length || Object.keys(input.data.answers).some((id) => !claims.ids.includes(id))) return res.status(400).json({ success: false, message: 'Invalid question selection' });
  const promise = (async () => {
    const result = { ...gradeAnswers(questions, input.data.answers), mode: claims.mode, attemptId: key, elapsedSeconds: Math.max(0, Math.floor((Math.min(Date.now(), claims.deadline || Date.now()) - claims.startedAt) / 1000)), timedOut: Boolean(claims.deadline && Date.now() >= claims.deadline) };
    await saveResult(student, lessons, result);
    return result;
  })();
  submissions.set(key, { expiresAt: claims.exp * 1000, promise });
  try { return res.json({ success: true, result: await promise }); }
  catch (error) { submissions.delete(key); throw error; }
};
module.exports = { catalog, start, submit };
