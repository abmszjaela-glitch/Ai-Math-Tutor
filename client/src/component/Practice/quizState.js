const NUMBER = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
export function validAnswer(question, value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  return question.options ? question.options.includes(value) : NUMBER.test(value.trim()) && Number.isFinite(Number(value));
}
export function validAttempt(attempt, mode) {
  if (!attempt || attempt.mode !== mode || typeof attempt.token !== 'string' || !attempt.token || typeof attempt.title !== 'string' || !Number.isFinite(attempt.startedAt)) return false;
  if ((attempt.expiresAt !== undefined && (!Number.isFinite(attempt.expiresAt) || attempt.expiresAt <= attempt.startedAt)) || (attempt.clockOffsetMs !== undefined && !Number.isFinite(attempt.clockOffsetMs))) return false;
  if (!Array.isArray(attempt.questions) || ![6, 12, 20].includes(attempt.questions.length)) return false;
  if (mode === 'practice' && (attempt.questions.length !== 6 || attempt.deadline !== null)) return false;
  if (mode === 'mock' && (![12, 20].includes(attempt.questions.length) || !Number.isFinite(attempt.deadline) || !Number.isFinite(attempt.durationSeconds) || attempt.durationSeconds <= 0 || attempt.deadline <= attempt.startedAt)) return false;
  const ids = new Set();
  return attempt.questions.every((q) => {
    if (!q || typeof q.id !== 'string' || !q.id || ids.has(q.id) || typeof q.prompt !== 'string' || !q.prompt || typeof q.subject !== 'string' || typeof q.difficulty !== 'string') return false;
    ids.add(q.id);
    return q.options === null || (Array.isArray(q.options) && q.options.length >= 2 && q.options.every((v) => typeof v === 'string') && new Set(q.options).size === q.options.length);
  });
}
export function validResult(result, attempt) {
  if (!result || !Array.isArray(result.reviews) || result.reviews.length !== attempt.questions.length || result.total !== attempt.questions.length || !Number.isInteger(result.correct) || !Number.isInteger(result.answered) || result.correct < 0 || result.correct > result.answered || result.answered > result.total || result.score !== Math.round(result.correct / result.total * 100) || !Number.isFinite(result.elapsedSeconds) || result.elapsedSeconds < 0) return false;
  if (result.reviews.filter((q) => q?.correct === true).length !== result.correct || result.reviews.filter((q) => typeof q?.submitted === 'string' && q.submitted.trim() !== '').length !== result.answered) return false;
  const ids = new Set(attempt.questions.map((q) => q.id));
  return result.reviews.every((q) => q && ids.delete(q.id) && typeof q.correct === 'boolean' && ['prompt', 'subject', 'answer', 'explanation', 'submitted'].every((key) => typeof q[key] === 'string')) && ids.size === 0;
}
export function readQuizSnapshot(key, mode, storage, now = Date.now()) {
  if (!key) return null;
  try {
    const value = JSON.parse((storage || globalThis.sessionStorage).getItem(key));
    if (!validAttempt(value?.attempt, mode)) return null;
    const { attempt } = value;
    const offset = Number.isFinite(attempt.clockOffsetMs) ? attempt.clockOffsetMs : 0;
    if (now + offset >= (attempt.expiresAt || attempt.startedAt + 7200000)) return null;
    const ids = new Set(attempt.questions.map((q) => q.id));
    const rawAnswers = value.answers && typeof value.answers === 'object' && !Array.isArray(value.answers) ? value.answers : {};
    const answers = Object.fromEntries(Object.entries(rawAnswers).filter(([id, answer]) => ids.has(id) && typeof answer === 'string' && answer.length <= 80));
    const flags = Array.isArray(value.flags) ? [...new Set(value.flags.filter((id) => ids.has(id)))] : [];
    const index = Number.isInteger(value.index) ? Math.max(0, Math.min(value.index, attempt.questions.length - 1)) : 0;
    return { attempt, answers, flags, index, submitted: value.submitted === true, result: validResult(value.result, attempt) ? value.result : null };
  } catch { return null; }
}
export function remainingSeconds(attempt, now = Date.now()) {
  if (!attempt?.deadline) return null;
  return Math.min(attempt.durationSeconds, Math.max(0, Math.ceil((attempt.deadline - now - (attempt.clockOffsetMs || 0)) / 1000)));
}
