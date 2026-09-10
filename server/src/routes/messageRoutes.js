const express = require("express");

const {
  addMessage,
  getMessages,
} = require("../controllers/messageController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/conversations/:id/messages",
  authenticate,
  addMessage
);

router.get(
  "/conversations/:id/messages",
  authenticate,
  getMessages
);

module.exports = router;