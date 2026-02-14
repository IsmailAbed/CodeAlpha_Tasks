const User = require("../models/User");
const Post = require("../models/Post");

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username")
      .populate("following", "username");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    if (req.user !== req.params.id)
      return res.status(403).json({ message: "Not authorized" });

    const { bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { bio },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Posts
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle Follow
exports.toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user;

    if (targetUserId === currentUserId)
      return res.status(400).json({ message: "You cannot follow yourself" });

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser)
      return res.status(404).json({ message: "User not found" });

    const alreadyFollowing = currentUser.following.includes(targetUserId);

    if (alreadyFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId
      );
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: alreadyFollowing
        ? "Unfollowed successfully"
        : "Followed successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
