const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
} = require("../controllers/studentController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authenticate, getMyProfile);
router.put("/me", authenticate, updateMyProfile);
router.delete("/me", authenticate, deleteMyProfile);

module.exports = router;