const prisma = require("../config/prisma");

const getMyProgress = async (req, res) => {
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

    const progress = await prisma.studentProgress.findMany({
      where: {
        studentId: student.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        lesson: {
          include: {
            topic: {
              include: {
                grade: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Get progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get student progress",
    });
  }
};

const updateLessonProgress = async (req, res) => {
  try {
    const { lessonId, completed, score } = req.body;

    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: "Lesson ID is required",
      });
    }

    if (
      completed !== undefined &&
      typeof completed !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "Completed must be true or false",
      });
    }

    if (
      score !== undefined &&
      (typeof score !== "number" || score < 0 || score > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Score must be a number between 0 and 100",
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

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const progress = await prisma.studentProgress.upsert({
      where: {
        studentId_lessonId: {
          studentId: student.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed: completed ?? undefined,
        score: score ?? undefined,
        attempts: {
          increment: 1,
        },
      },
      create: {
        studentId: student.id,
        lessonId: lessonId,
        completed: completed ?? false,
        score: score ?? null,
        attempts: 1,
      },
      include: {
        lesson: {
          include: {
            topic: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lesson progress updated successfully",
      progress,
    });
  } catch (error) {
    console.error("Update lesson progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update lesson progress",
    });
  }
};

const getProgressSummary = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: {
        userId: req.userId,
      },
      include: {
        grade: true,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const topics = await prisma.topic.findMany({
      where: {
        gradeId: student.gradeId,
      },
      orderBy: {
        name: "asc",
      },
      include: {
        lessons: {
          select: {
            id: true,
          },
        },
      },
    });

    const progress = await prisma.studentProgress.findMany({
      where: {
        studentId: student.id,
      },
      select: {
        lessonId: true,
        completed: true,
      },
    });

    const completedLessonIds = new Set(
      progress
        .filter((item) => item.completed)
        .map((item) => item.lessonId)
    );

    const summary = topics.map((topic) => {
      const totalLessons = topic.lessons.length;

      const completedLessons = topic.lessons.filter((lesson) =>
        completedLessonIds.has(lesson.id)
      ).length;

      const percentage =
        totalLessons === 0
          ? 0
          : Math.round(
              (completedLessons / totalLessons) * 100
            );

      return {
        topicId: topic.id,
        topic: topic.name,
        totalLessons,
        completedLessons,
        percentage,
      };
    });

    return res.status(200).json({
      success: true,
      grade: {
        id: student.grade.id,
        number: student.grade.number,
        name: student.grade.name,
      },
      summary,
    });
  } catch (error) {
    console.error("Get progress summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get progress summary",
    });
  }
};

module.exports = {
  getMyProgress,
  updateLessonProgress,
  getProgressSummary,
};