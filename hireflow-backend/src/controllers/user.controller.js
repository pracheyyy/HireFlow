const User = require("../models/user.model");
const { asyncHandler } = require("../middleware/error.middleware");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  skills: user.skills,
  education: user.education,
  role: user.role,
  isVerified: user.isVerified,
  provider: user.provider,
});

// PATCH /api/users/me
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "avatar", "skills", "education"];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: "Profile updated", data: sanitizeUser(user) });
});

module.exports = { updateProfile };
