const express = require("express");

const {
  sendTutorMessage,
} = require("../controllers/tutorController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/message",
  authenticate,
  sendTutorMessage
);

module.exports = router;