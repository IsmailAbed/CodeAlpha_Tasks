const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getUserProfile,
  updateProfile,
  getUserPosts,
  toggleFollow
} = require("../controllers/userController");

router.get("/:id", authMiddleware, getUserProfile);
router.put("/:id", authMiddleware, updateProfile);
router.get("/:id/posts", authMiddleware, getUserPosts);
router.put("/:id/follow", authMiddleware, toggleFollow);

module.exports = router;
