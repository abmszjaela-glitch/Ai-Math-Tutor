const express = require("express");

const {
  getAvatars,
  selectAvatar,
} = require("../controllers/avatarController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getAvatars);

router.put("/me", authenticate, selectAvatar);

module.exports = router;