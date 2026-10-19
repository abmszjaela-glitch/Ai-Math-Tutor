const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const { tutorInput, tutorOutput, progressInput, messageInput } = require('../src/utils/validation');
const valid = { message: 'Add the ones, then the tens.', steps: [{ step: 1, explanation: 'Add', calculation: '25 + 17 = 42' }], answer: '42', hint: '', encouragement: 'Well done!', topic: 'Addition', difficulty: 'easy' };
function fixture({ output = JSON.stringify(valid), owner = true, upstreamError, lessonGrade = 'grade-1' } = {}) {
  const writes = [], requests = [];
  const prisma = {
    student: { findUnique: async () => ({ id: 'student-1', gradeId: 'grade-1', grade: { number: 1 }, avatar: { name: 'Koala', personality: 'Gentle' } }) },
    conversation: {
      findFirst: async (query) => { assert.equal(query.where.studentId, 'student-1'); return owner ? { id: 'chat-1', messages: [{ role: 'assistant', content: 'Previous answer' }, { role: 'user', content: 'Previous question' }] } : null; },
      update: async (value) => writes.push(['conversation', value]),
    },
    lesson: { findUnique: async () => ({ title: 'Addition', topic: { name: 'Algebra', gradeId: lessonGrade } }) },
    message: { create: async (value) => { writes.push(['message', value.data]); return { id: 'message-1' }; } },
    $transaction: async (callback) => { writes.push(['transaction']); return callback(prisma); },
  };
  const api = { chat: { completions: { create: async (value) => { requests.push(value); if (upstreamError) throw upstreamError; return { choices: [{ message: { content: output } }] }; } } } };
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/controllers/tutorController.js'), 'utf8'), {
    require(name) { if (name === '../config/prisma') return prisma; if (name === '../config/openai') return () => api; if (name === '../utils/validation') return { tutorInput, tutorOutput }; return require(name); },
    module, process: { env: {} }, console: { error() {} },
  });
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(data) { this.body = data; return this; } };
  return { send: module.exports.sendTutorMessage, res, writes, requests };
}
const req = (body = {}) => ({ userId: 'user-1', body: { conversationId: 'chat-1', message: '25 + 17?', ...body } });
test('rejects empty, oversized and wrongly typed tutor input', () => {
  for (const body of [{ message: ' ' }, { message: 'x'.repeat(4001) }, { conversationId: {} }, { lessonId: 4 }]) assert.equal(tutorInput.safeParse(req(body).body).success, false);
});
test('rejects invalid progress, spoofed assistant messages and null steps', () => {
  for (const score of [NaN, Infinity, -1, 101, '5']) assert.equal(progressInput.safeParse({ lessonId: 'l', score }).success, false);
  assert.equal(progressInput.safeParse({ lessonId: 'l' }).success, false);
  assert.equal(messageInput.safeParse({ role: 'assistant', content: 'Spoofed reply' }).success, false);
  assert.equal(messageInput.safeParse({ content: ' ' }).success, false);
  assert.equal(tutorOutput.safeParse({ ...valid, steps: [null] }).success, false);
});
test('validates input before accessing the AI', async () => {
  const f = fixture(); await f.send(req({ conversationId: 5 }), f.res);
  assert.equal(f.res.statusCode, 400); assert.equal(f.requests.length, 0); assert.equal(f.writes.length, 0);
});
test('prevents access to another student conversation', async () => {
  const f = fixture({ owner: false }); await f.send(req(), f.res);
  assert.equal(f.res.statusCode, 404); assert.equal(f.requests.length, 0); assert.equal(f.writes.length, 0);
});
test('rejects a lesson from another grade', async () => {
  const f = fixture({ lessonGrade: 'grade-6' }); await f.send(req({ lessonId: 'lesson' }), f.res);
  assert.equal(f.res.statusCode, 404); assert.equal(f.writes.length, 0);
});
test('stores the complete exchange in one transaction after a valid reply', async () => {
  const f = fixture(); await f.send(req(), f.res);
  assert.equal(f.res.statusCode, 200); assert.equal(f.res.body.response.tutor.answer, '42');
  assert.deepEqual(f.writes.map(([type]) => type), ['transaction', 'message', 'message', 'conversation']);
  assert.deepEqual(Array.from(f.requests[0].messages, (m) => m.role), ['system', 'user', 'assistant', 'user']);
  assert.match(f.requests[0].messages[0].content, /Koala/);
});
for (const output of ['not JSON', 'null', JSON.stringify({ ...valid, steps: [null] }), JSON.stringify({ ...valid, difficulty: 'impossible' })]) {
  test(`invalid upstream response does not save partial messages: ${output.slice(0, 30)}`, async () => {
    const f = fixture({ output }); await f.send(req(), f.res);
    assert.equal(f.res.statusCode, 502); assert.equal(f.writes.length, 0);
  });
}
test('rate limits remain retryable without creating duplicate messages', async () => {
  const f = fixture({ upstreamError: { status: 429, message: 'Busy' } });
  await f.send(req(), f.res); assert.equal(f.res.statusCode, 429); assert.equal(f.writes.length, 0);
  await f.send(req(), f.res); assert.equal(f.res.statusCode, 429); assert.equal(f.requests.length, 2);
});
test('overlapping requests are rejected for the same conversation', async () => {
  const f = fixture(); const first = f.send(req(), f.res);
  const secondRes = { ...f.res }; await f.send(req(), secondRes); await first;
  assert.equal(secondRes.statusCode, 409); assert.equal(f.requests.length, 1);
});
