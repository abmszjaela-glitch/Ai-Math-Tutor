const express = require("express");

const {
  getGrades,
  getTopicsByGrade,
  getLessonsByTopic,
} = require("../controllers/curriculumController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/grades", authenticate, getGrades);
router.get(
  "/grades/:gradeId/topics",
  authenticate,
  getTopicsByGrade
);
router.get(
  "/topics/:topicId/lessons",
  authenticate,
  getLessonsByTopic
);

module.exports = router;