const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const loadController = (prisma) => {
  const module = { exports: {} };
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, '../src/controllers/conversationController.js'), 'utf8'),
    {
      require(name) {
        if (name === '../config/prisma') return prisma;
        if (name === '../utils/validation') return { conversationInput: {} };
        return require(name);
      },
      module,
      console: { error() {} },
    }
  );
  return module.exports;
};

const createResponse = () => ({
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

test('conversation history returns the student, avatar selections, and full conversations', async () => {
  const student = {
    id: 'student-1',
    name: 'Sam',
    user: { email: 'sam@example.com' },
    grade: { number: 4 },
    avatar: { id: 'avatar-2', name: 'Panda' },
  };
  const avatarSelections = [
    { id: 'selection-1', avatarId: 'avatar-1', avatar: { name: 'Kangaroo' } },
  ];
  const conversations = [
    {
      id: 'conversation-1',
      avatar: { name: 'Kangaroo' },
      messages: [{ role: 'user', content: 'What is 2 + 2?' }],
    },
  ];
  let avatarSelectionQuery;
  let conversationQuery;

  const prisma = {
    student: { findUnique: async () => student },
    avatarSelection: {
      findMany: async (query) => {
        avatarSelectionQuery = query;
        return avatarSelections;
      },
    },
    conversation: {
      findMany: async (query) => {
        conversationQuery = query;
        return conversations;
      },
    },
  };
  const { getMyConversationHistory } = loadController(prisma);
  const res = createResponse();

  await getMyConversationHistory({ userId: 'user-1' }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.student.name, 'Sam');
  assert.equal(res.body.student.currentAvatar.name, 'Panda');
  assert.equal(res.body.avatarSelections[0].avatar.name, 'Kangaroo');
  assert.equal(res.body.conversations[0].messages[0].content, 'What is 2 + 2?');
  assert.equal(avatarSelectionQuery.where.studentId, 'student-1');
  assert.equal(conversationQuery.where.studentId, 'student-1');
  assert.equal(conversationQuery.include.messages.orderBy.createdAt, 'asc');
});

test('conversation history returns 404 when the authenticated user has no student', async () => {
  const prisma = {
    student: { findUnique: async () => null },
    avatarSelection: { findMany: async () => assert.fail('must not query avatar history') },
    conversation: { findMany: async () => assert.fail('must not query conversations') },
  };
  const { getMyConversationHistory } = loadController(prisma);
  const res = createResponse();

  await getMyConversationHistory({ userId: 'user-without-student' }, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.body.success, false);
});
