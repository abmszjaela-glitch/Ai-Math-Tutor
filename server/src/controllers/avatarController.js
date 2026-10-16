const { avatarInput } = require("../utils/validation");
const prisma = require("../config/prisma");

const getAvatars = async (req, res) => {
  try {
    const avatars = await prisma.avatar.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        personality: true,
        imageUrl: true,
        voiceId: true,
      },
    });

    return res.status(200).json({
      success: true,
      avatars,
    });
  } catch (error) {
    console.error("Get avatars error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get avatars",
    });
  }
};

const selectAvatar = async (req, res) => {
  try {
    const validation = avatarInput.safeParse(req.body);
    if (!validation.success) return res.status(400).json({ success: false, message: "Invalid request data", errors: validation.error.flatten().fieldErrors });
    const { avatarId } = validation.data;

    const avatar = await prisma.avatar.findUnique({
      where: {
        id: avatarId,
      },
    });

    if (!avatar) {
      return res.status(404).json({
        success: false,
        message: "Avatar not found",
      });
    }

    const student = await prisma.student.update({
      where: {
        userId: req.userId,
      },
      data: {
        avatarId: avatar.id,
      },
      include: {
        grade: true,
        avatar: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Avatar selected successfully",
      student: {
        id: student.id,
        name: student.name,
        grade: {
          number: student.grade.number,
          name: student.grade.name,
        },
        avatar: {
          id: student.avatar.id,
          name: student.avatar.name,
          personality: student.avatar.personality,
          imageUrl: student.avatar.imageUrl,
        },
      },
    });
  } catch (error) {
    console.error("Select avatar error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to select avatar",
    });
  }
};

module.exports = {
  getAvatars,
  selectAvatar,
};  