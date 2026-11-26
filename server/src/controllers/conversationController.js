const { conversationInput } = require("../utils/validation");
const prisma = require("../config/prisma");

const createConversation = async (req, res) => {
  try {
    const validation = conversationInput.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ success: false, message: "Invalid conversation title" });
    const { title } = validation.data;

    const student = await prisma.student.findUnique({
      where: {
        userId: req.userId,
      },
      select: {
        id: true,
        avatarId: true,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const conversation = await prisma.conversation.create({
      data: {
        studentId: student.id,
        avatarId: student.avatarId,
        title: title || "Math Tutor Session",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create conversation",
    });
  }
};


const getMyConversations = async (req, res) => {
  try {
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

    const conversations = await prisma.conversation.findMany({
      where: {
        studentId: student.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get conversations",
    });
  }
};

const getMyConversationHistory = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: {
        userId: req.userId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        grade: true,
        avatar: true,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const [avatarSelections, conversations] = await Promise.all([
      prisma.avatarSelection.findMany({
        where: {
          studentId: student.id,
        },
        orderBy: [
          { selectedAt: "asc" },
          { id: "asc" },
        ],
        include: {
          avatar: true,
        },
      }),
      prisma.conversation.findMany({
        where: {
          studentId: student.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          avatar: true,
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.user.email,
        grade: student.grade,
        currentAvatar: student.avatar,
      },
      avatarSelections,
      conversations,
    });
  } catch (error) {
    console.error("Get conversation history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get conversation history",
    });
  }
};


const getConversationById = async (req, res) => {
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
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Get conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get conversation",
    });
  }
};


module.exports = {
  createConversation,
  getMyConversations,
  getMyConversationHistory,
  getConversationById,
};