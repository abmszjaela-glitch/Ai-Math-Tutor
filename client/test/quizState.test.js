import test from 'node:test';
import assert from 'node:assert/strict';
import { validAnswer, validAttempt, validResult, readQuizSnapshot, remainingSeconds } from '../src/component/Practice/quizState.js';
const now = 1000000;
const attempt = { token: 'signed-test', mode: 'practice', title: 'Patterns', startedAt: now, deadline: null, durationSeconds: null, questions: Array.from({ length: 6 }, (_, i) => ({ id: `q${i}`, prompt: 'What is 2 + 2?', subject: 'Algebra', difficulty: 'easy', options: i % 2 ? ['3', '4', '5'] : null })) };
const storage = (value) => ({ getItem: () => typeof value === 'string' ? value : JSON.stringify(value) });
const result = { total: 6, correct: 1, answered: 1, score: 17, elapsedSeconds: 5, reviews: attempt.questions.map((q, i) => ({ ...q, answer: '4', explanation: '2 + 2 = 4.', submitted: i === 0 ? '4' : '', correct: i === 0 })) };
test('numeric answers accept zero, signs and decimals but reject text, expressions and non-finite values', () => {
  for (const value of ['0', '-2', '+4', '.5', ' 4.0 ', '4.']) assert.ok(validAnswer(attempt.questions[0], value));
  for (const value of ['', ' ', '2+2', '0x4', 'Infinity', '4 apples', '1e309', 'NaN', null, 4, {}]) assert.equal(validAnswer(attempt.questions[0], value), false);
});
test('multiple choice requires one of the actual options', () => { assert.ok(validAnswer(attempt.questions[1], '4')); assert.equal(validAnswer(attempt.questions[1], '4.0'), false); assert.equal(validAnswer(attempt.questions[1], '8'), false); });
test('valid attempt accepted; malformed, empty and duplicate questions rejected', () => {
  assert.ok(validAttempt(attempt, 'practice'));
  for (const value of [null, {}, { ...attempt, questions: [] }, { ...attempt, questions: [...attempt.questions.slice(0,5), null] }, { ...attempt, questions: Array(6).fill(attempt.questions[0]) }, { ...attempt, questions: attempt.questions.map(q => ({ ...q, options: {} })) }]) assert.equal(validAttempt(value, 'practice'), false);
  assert.equal(validAttempt(attempt, 'mock'), false);
});
test('saved answer shapes, flags and question index are sanitised without crashes', () => {
  const restored = readQuizSnapshot('key', 'practice', storage({ attempt, answers: { q0: 12, q1: '4', foreign: '4' }, flags: ['q1','foreign','q1'], index: 999 }), now);
  assert.deepEqual(restored.answers, { q1: '4' }); assert.deepEqual(restored.flags, ['q1']); assert.equal(restored.index,5);
  const malformed = readQuizSnapshot('key', 'practice', storage({ attempt, answers: [], flags: {}, index: 2.5 }), now);
  assert.deepEqual(malformed.answers,{}); assert.deepEqual(malformed.flags,[]); assert.equal(malformed.index,0);
});
test('corrupted, expired, wrong-mode and inaccessible storage do not crash', () => {
  assert.equal(readQuizSnapshot('key','practice',storage('not json'),now),null);
  assert.equal(readQuizSnapshot('key','practice',storage({ attempt }),now+7200000),null);
  assert.equal(readQuizSnapshot('key','mock',storage({ attempt }),now),null);
  assert.equal(readQuizSnapshot('key','practice',{getItem(){throw new Error('disabled');}},now),null);
});
test('a completed result and a pending submission survive refresh', () => {
  assert.ok(validResult(result,attempt));
  assert.deepEqual(readQuizSnapshot('key','practice',storage({attempt,result,submitted:true}),now).result,result);
  assert.equal(readQuizSnapshot('key','practice',storage({attempt,submitted:true}),now).submitted,true);
});
test('inconsistent and malformed results are rejected', () => {
  for(const value of [null,{}, {...result,score:100}, {...result,correct:9}, {...result,answered:-1}, {...result,reviews:[null,...result.reviews.slice(1)]}, {...result,reviews:[]}]) assert.equal(validResult(value,attempt),false);
});
test('timer reaches zero, never goes negative, and respects server clock offset', () => {
  const timed = { ...attempt, mode:'mock', durationSeconds:60, deadline:now+60000, clockOffsetMs:5000 };
  assert.equal(remainingSeconds(timed,now-5000),60);
  assert.equal(remainingSeconds(timed,now+5000),50);
  assert.equal(remainingSeconds(timed,now+55000),0);
  assert.equal(remainingSeconds(timed,now+90000),0);
  assert.equal(remainingSeconds(attempt,now),null);
});
