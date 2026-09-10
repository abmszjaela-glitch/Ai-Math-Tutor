const express = require("express");

const {
  getMyProgress,
  updateLessonProgress,
  getProgressSummary,
} = require("../controllers/progressController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/me",
  authenticate,
  getMyProgress
);

router.get(
  "/summary",
  authenticate,
  getProgressSummary
);

router.post(
  "/lesson",
  authenticate,
  updateLessonProgress
);

module.exports = router;