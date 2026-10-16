const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const jwt = require('jsonwebtoken');
const bank = require('../src/data/practiceBank');
const SECRET = 'practice-test-secret-at-least-32-characters';
function fixture(grade = 4) {
  const progress = new Map(); let transactions = 0;
  const student = { id: 'student-1', name: 'Test Learner', gradeId: `grade-${grade}`, grade: { number: grade } };
  const tx = { topic: { upsert: async (q) => q.create }, lesson: { upsert: async (q) => q.create }, studentProgress: {
    updateMany: async (q) => { const old = progress.get(q.where.lessonId); if (old && (q.where.OR ? old.score === null || old.score < q.data.score : old.completed === q.where.completed)) progress.set(q.where.lessonId, { ...old, ...q.data }); return { count: 1 }; },
    findMany: async () => [...progress.values()],
    findUnique: async (q) => progress.get(q.where.studentId_lessonId.lessonId) || null,
    upsert: async (q) => { const id = q.where.studentId_lessonId.lessonId, old = progress.get(id); const value = old ? { ...old, ...q.update, attempts: old.attempts + 1 } : q.create; progress.set(id, value); return value; },
  } };
  const prisma = { ...tx, student: { findUnique: async () => student }, $transaction: async (fn) => { transactions++; return fn(tx); } };
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/controllers/practiceController.js'), 'utf8'), {
    require(name) { if (name === '../config/prisma') return prisma; if (name === '../data/practiceBank') return bank; return require(name); },
    process: { env: { JWT_SECRET: SECRET } }, module, Date, Map, Set, Math, Object, Array,
  });
  async function call(action, body, userId = 'user-1') { const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } }; await module.exports[action]({ userId, body }, res); return res; }
  return { call, progress, student, transactions: () => transactions };
}
function correctAnswers(token) {
  const claims = jwt.decode(token); const questions = new Map(bank.getLessons(claims.grade).flatMap((l) => l.questions).map((q) => [q.id, q]));
  return Object.fromEntries(claims.ids.map((id) => [id, questions.get(id).answer]));
}
test('six grades contain 48 unique lessons and 288 valid questions', () => {
  const ids = new Set(); let lessons = 0;
  for (let grade = 1; grade <= 6; grade++) {
    const curriculum = bank.getLessons(grade); lessons += curriculum.length;
    assert.equal(curriculum.length, 8); assert.equal(new Set(curriculum.map((l) => l.subject)).size, 4);
    for (const lesson of curriculum) {
      assert.equal(lesson.steps.length, 3); assert.ok(lesson.example.length > 10);
      for (const q of lesson.questions) {
        assert.ok(!ids.has(q.id)); ids.add(q.id); assert.ok(Number.isFinite(Number(q.answer))); assert.ok(q.explanation.length > 10);
        if (q.options) { assert.equal(q.options.length, 4); assert.equal(new Set(q.options).size, 4); assert.ok(q.options.includes(q.answer)); }
        assert.ok(!('answer' in bank.publicQuestion(q))); assert.ok(!('explanation' in bank.publicQuestion(q)));
      }
    }
  }
  assert.equal(lessons, 48); assert.equal(ids.size, 288);
});
test('independently checked maths examples give correct answers', () => {
  const find = (g, slug, i) => bank.getLessons(g).find((l) => l.slug === slug).questions[i - 1].answer;
  for (const [g, slug, i, answer] of [[1,'patterns',1,'8'],[1,'equations',1,'3'],[4,'equations',1,'9'],[4,'length',1,'27'],[4,'length',2,'28'],[6,'time-money',1,'120'],[6,'time-money',2,'54'],[6,'word-problems',1,'27'],[6,'groups',1,'22'],[6,'data-summary',1,'9'],[6,'data-summary',2,'4']]) assert.equal(find(g,slug,i),answer);
});
test('blanks and malformed numbers are wrong; decimal equivalents are accepted', () => {
  const q = [{ id: 'q', answer: '4' }];
  for (const answer of ['', ' ', '0x4', 'Infinity', 'four', '4 apples', '2+2']) assert.equal(bank.gradeAnswers(q, { q: answer }).score, 0);
  assert.equal(bank.gradeAnswers(q, { q: ' 4.0 ' }).score, 100); assert.equal(bank.gradeAnswers(q, {}).answered, 0);
});
test('catalog is grade-specific and does not expose questions', async () => {
  const f = fixture(2), r = await f.call('catalog'); assert.equal(r.body.student.grade, 2); assert.equal(r.body.lessons.length, 8); assert.ok(r.body.lessons.every((l) => l.id.startsWith('g2-') && !l.questions));
});
test('practice hides answers and explanations until submission', async () => {
  const f = fixture(), r = await f.call('start', { mode: 'practice', lessonId: 'g4-length' });
  assert.equal(r.statusCode, 201); assert.equal(r.body.attempt.questions.length, 6); assert.equal(r.body.attempt.deadline, null);
  assert.ok(r.body.attempt.questions.every((q) => !('answer' in q) && !('explanation' in q)));
  assert.equal(jwt.verify(r.body.attempt.token, SECRET, { audience: 'math-practice' }).userId, 'user-1');
});
for (const count of [12, 20]) test(`mock ${count}: unique questions, equal topic coverage, server deadline`, async () => {
  const f = fixture(), r = await f.call('start', { mode: 'mock', count }), a = r.body.attempt;
  assert.equal(a.questions.length, count); assert.equal(new Set(a.questions.map((q) => q.id)).size, count); assert.equal(a.deadline - a.startedAt, count * 60000);
  for (const subject of bank.SUBJECTS) assert.equal(a.questions.filter((q) => q.subject === subject).length, count / 4);
});
test('rejects invalid and cross-grade starts', async () => {
  const f = fixture(); assert.equal((await f.call('start', { mode: 'mock', count: 13 })).statusCode, 400); assert.equal((await f.call('start', { mode: 'practice', lessonId: 'g1-length' })).statusCode, 404);
});
test('perfect practice saves mastery and duplicate retry does not add attempts', async () => {
  const f = fixture(), started = await f.call('start', { mode: 'practice', lessonId: 'g4-length' }), token = started.body.attempt.token;
  assert.equal((await f.call('submit', { token, answers: correctAnswers(token) })).body.result.score, 100); assert.equal([...f.progress.values()][0].completed, true);
  assert.equal((await f.call('submit', { token, answers: {} })).body.result.score, 100); assert.equal(f.transactions(), 1); assert.equal([...f.progress.values()][0].attempts, 1);
});
test('lower retake preserves best score and mastery', async () => {
  const f = fixture(); let s = await f.call('start', { mode: 'practice', lessonId: 'g4-length' }); await f.call('submit', { token: s.body.attempt.token, answers: correctAnswers(s.body.attempt.token) });
  s = await f.call('start', { mode: 'practice', lessonId: 'g4-length' }); assert.equal((await f.call('submit', { token: s.body.attempt.token, answers: {} })).body.result.score, 0);
  const p = [...f.progress.values()][0]; assert.equal(p.score, 100); assert.equal(p.completed, true); assert.equal(p.attempts, 2);
});
test('mock subset scores do not master a full lesson', async () => {
  const f = fixture(), s = await f.call('start', { mode: 'mock', count: 20 }), token = s.body.attempt.token;
  assert.equal((await f.call('submit', { token, answers: correctAnswers(token) })).body.result.score, 100); assert.ok([...f.progress.values()].every((p) => p.completed === false));
});
test('forged, cross-account, foreign-question and expired submissions are rejected', async () => {
  const f = fixture(), s = await f.call('start', { mode: 'mock', count: 12 }), token = s.body.attempt.token;
  assert.equal((await f.call('submit', { token: 'invalid', answers: {} })).statusCode, 401); assert.equal((await f.call('submit', { token, answers: {} }, 'other-user')).statusCode, 403); assert.equal((await f.call('submit', { token, answers: { foreign: '1' } })).statusCode, 400);
  const claims = jwt.decode(token); delete claims.iat; delete claims.exp; delete claims.aud;
  const expired = jwt.sign({ ...claims, deadline: Date.now() - 31000 }, SECRET, { audience: 'math-practice', expiresIn: '2h' });
  assert.equal((await f.call('submit', { token: expired, answers: {} })).statusCode, 410); assert.equal(f.progress.size, 0);
});
test('grade change invalidates a started test', async () => {
  const f = fixture(), s = await f.call('start', { mode: 'mock', count: 12 }); f.student.grade.number = 6; assert.equal((await f.call('submit', { token: s.body.attempt.token, answers: {} })).statusCode, 403);
});
test('simultaneous duplicate submissions are coalesced', async () => {
  const f = fixture(), s = await f.call('start', { mode: 'practice', lessonId: 'g4-patterns' }), token = s.body.attempt.token, answers = correctAnswers(token);
  const results = await Promise.all([f.call('submit', { token, answers }), f.call('submit', { token, answers })]); assert.ok(results.every((r) => r.body.result.score === 100)); assert.equal(f.transactions(), 1);
});
