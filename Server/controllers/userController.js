const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.status(200).json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  res.status(200).json(user);
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  const { name, email, mobile, address, role, isActive, password } = req.body;

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email.toLowerCase();
  if (mobile !== undefined) user.mobile = mobile;
  if (address !== undefined) user.address = address;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (password !== undefined) user.password = password;

  const updatedUser = await user.save();

  res.status(200).json({
    message: "User updated successfully.",
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      mobile: updatedUser.mobile,
      address: updatedUser.address,
      isActive: updatedUser.isActive,
    },
  });
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  user.isActive = false;
  await user.save();

  res.status(200).json({ message: "User marked inactive successfully." });
});

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
