const prisma = require("../config/prisma");

const addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, content } = req.body;

    if (!role || !content) {
      return res.status(400).json({
        success: false,
        message: "Role and content are required",
      });
    }

    if (!["user", "assistant"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be user or assistant",
      });
    }

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

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role,
        content,
      },
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