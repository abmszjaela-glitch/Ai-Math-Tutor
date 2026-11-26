const { z } = require("zod");

const prisma = require("../config/prisma");

const updateStudentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .email("Please enter a valid email")
    .optional(),
  grade: z.number().int().min(1).max(6).optional(),
  avatarId: z.string().trim().min(1).nullable().optional(),
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

    const { name, email, grade, avatarId } = validation.data;

    let gradeRecord;
    if (grade !== undefined) {
      gradeRecord = await prisma.grade.findUnique({
        where: { number: grade },
      });

      if (!gradeRecord) {
        return res.status(400).json({
          success: false,
          message: "Selected grade does not exist",
        });
      }
    }

    if (avatarId !== undefined && avatarId !== null) {
      const avatar = await prisma.avatar.findUnique({
        where: { id: avatarId },
      });

      if (!avatar) {
        return res.status(404).json({
          success: false,
          message: "Avatar not found",
        });
      }
    }

    if (email !== undefined) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== req.userId) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists",
        });
      }
    }

    const student = await prisma.$transaction(async (tx) => {
      if (email !== undefined) {
        await tx.user.update({
          where: { id: req.userId },
          data: { email },
        });
      }

      const currentStudent = await tx.student.findUnique({
        where: { userId: req.userId },
        select: { id: true, avatarId: true },
      });

      const updatedStudent = await tx.student.update({
        where: { userId: req.userId },
        data: {
          ...(name !== undefined ? { name } : {}),
          ...(gradeRecord ? { gradeId: gradeRecord.id } : {}),
          ...(avatarId !== undefined ? { avatarId } : {}),
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

      if (
        avatarId &&
        currentStudent &&
        currentStudent.avatarId !== avatarId
      ) {
        await tx.avatarSelection.create({
          data: {
            studentId: updatedStudent.id,
            avatarId,
          },
        });
      }

      return updatedStudent;
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
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

const deleteMyProfile = async (req, res) => {
  try {
    const deleted = await prisma.user.delete({
      where: { id: req.userId },
      select: { id: true },
    });

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Student account deleted successfully",
      deletedUserId: deleted.id,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Student account not found",
      });
    }

    console.error("Delete student profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete student account",
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
};