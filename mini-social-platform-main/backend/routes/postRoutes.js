const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  toggleLike
} = require("../controllers/postController");


router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getAllPosts);
router.get("/:id", authMiddleware, getPostById);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id/like", authMiddleware, toggleLike);


module.exports = router;
