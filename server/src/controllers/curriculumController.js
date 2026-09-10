const prisma = require("../config/prisma");

const getGrades = async (req, res) => {
  try {
    const grades = await prisma.grade.findMany({
      orderBy: {
        number: "asc",
      },
      select: {
        id: true,
        number: true,
        name: true,
      },
    });

    return res.status(200).json({
      success: true,
      grades,
    });
  } catch (error) {
    console.error("Get grades error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get grades",
    });
  }
};


const getTopicsByGrade = async (req, res) => {
  try {
    const { gradeId } = req.params;

    const grade = await prisma.grade.findUnique({
      where: {
        id: gradeId,
      },
      select: {
        id: true,
        number: true,
        name: true,
      },
    });

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: "Grade not found",
      });
    }

    const topics = await prisma.topic.findMany({
      where: {
        gradeId: gradeId,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return res.status(200).json({
      success: true,
      grade,
      topics,
    });
  } catch (error) {
    console.error("Get topics error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get topics",
    });
  }
};

const getLessonsByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await prisma.topic.findUnique({
      where: {
        id: topicId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        grade: {
          select: {
            id: true,
            number: true,
            name: true,
          },
        },
      },
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        topicId: topicId,
      },
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
      },
    });

    return res.status(200).json({
      success: true,
      topic,
      lessons,
    });
  } catch (error) {
    console.error("Get lessons error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get lessons",
    });
  }
};

module.exports = {
  getGrades,
  getTopicsByGrade,
  getLessonsByTopic,
};