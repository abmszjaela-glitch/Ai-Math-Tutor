const express = require("express");

const {
  createConversation,
  getMyConversations,
  getConversationById,
} = require("../controllers/conversationController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticate,
  createConversation
);

router.get(
  "/",
  authenticate,
  getMyConversations
);

router.get(
  "/:id",
  authenticate,
  getConversationById
);

module.exports = router;