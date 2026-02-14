const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addComment,
  getCommentsByPost,
  deleteComment
} = require("../controllers/commentController");

router.post("/", authMiddleware, addComment);
router.get("/:postId", authMiddleware, getCommentsByPost);
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
