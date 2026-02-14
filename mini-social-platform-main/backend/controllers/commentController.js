const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Post not found" });

    const newComment = new Comment({
      post: postId,
      user: req.user,
      text
    });

    await newComment.save();

    const populatedComment = await newComment.populate("user", "username");

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Comments by Post
exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Comment (only owner)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user)
      return res.status(403).json({ message: "Not authorized" });

    await comment.deleteOne();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
