const { z } = require("zod");

const prisma = require("../config/prisma");

const updateStudentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
});

const getMyProfile = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: {
        userId: req.userId,
      },
      include: {
        user: {
          select: {
            id: true,
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
        message: "Student profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.user.email,
        grade: {
          id: student.grade.id,
          number: student.grade.number,
          name: student.grade.name,
        },
        avatar: student.avatar
          ? {
              id: student.avatar.id,
              name: student.avatar.name,
              imageUrl: student.avatar.imageUrl,
            }
          : null,
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    console.error("Get student profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get student profile",
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const validation = updateStudentSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile data",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { name } = validation.data;

    const student = await prisma.student.update({
      where: {
        userId: req.userId,
      },
      data: {
        name,
      },
      include: {
        grade: true,
        avatar: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      student: {
        id: student.id,
        name: student.name,
        grade: {
          id: student.grade.id,
          number: student.grade.number,
          name: student.grade.name,
        },
        avatar: student.avatar
          ? {
              id: student.avatar.id,
              name: student.avatar.name,
              imageUrl: student.avatar.imageUrl,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Update student profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update student profile",
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};