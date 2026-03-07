const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

const buildAuthResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  mobile: user.mobile,
  address: user.address,
  isActive: user.isActive,
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, mobile, address } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("name, email, and password are required.");
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(409);
    throw new Error("User already exists.");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    mobile,
    address,
  });

  const token = generateToken({ id: user._id, role: user.role });

  res.status(201).json({
    message: "User registered successfully.",
    token,
    user: buildAuthResponse(user),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("email and password are required.");
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("User account is inactive.");
  }

  const token = generateToken({ id: user._id, role: user.role });

  res.status(200).json({
    message: "Login successful.",
    token,
    user: buildAuthResponse(user),
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Logout successful. Remove token on client." });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  res.status(200).json(user);
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};
