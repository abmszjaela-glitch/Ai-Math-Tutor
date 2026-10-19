const { messageInput } = require("../utils/validation");
const prisma = require("../config/prisma");

const addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = messageInput.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ success: false, message: "Invalid request data", errors: validation.error.flatten().fieldErrors });
    const { role, content } = validation.data;

    const student = await prisma.student.findUnique({
      where: {
        userId: req.userId,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        studentId: student.id,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const message = await prisma.$transaction(async (tx) => {
      const saved = await tx.message.create({
      data: {
        conversationId: conversation.id,
        role,
        content,
      },
    });

      await tx.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });
      return saved;
    });

    return res.status(201).json({
      success: true,
      message: "Message added successfully",
      data: message,
    });
  } catch (error) {
    console.error("Add message error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add message",
    });
  }
};


const getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: {
        userId: req.userId,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        studentId: student.id,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get messages",
    });
  }
};


module.exports = {
  addMessage,
  getMessages,
};