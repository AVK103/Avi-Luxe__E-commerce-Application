const Admin = require("../models/Admin");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

const getAdminSummary = asyncHandler(async (req, res) => {
  const [userCount, productCount, orderCount, revenueData] = await Promise.all([
    User.countDocuments({}),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments({}),
    Order.aggregate([
      {
        $match: {
          status: { $in: ["confirmed", "shipped", "delivered"] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$prices.total" },
        },
      },
    ]),
  ]);

  res.status(200).json({
    users: userCount,
    products: productCount,
    orders: orderCount,
    totalRevenue: revenueData[0]?.totalRevenue || 0,
  });
});

const getAdminSettings = asyncHandler(async (req, res) => {
  const settings = await Admin.findOne({ adminUser: req.user._id }).populate(
    "adminUser",
    "name email"
  );

  if (!settings) {
    return res.status(200).json({
      adminUser: req.user._id,
      banner: [],
      categories: [],
    });
  }

  return res.status(200).json(settings);
});

const upsertAdminSettings = asyncHandler(async (req, res) => {
  const { banner, categories } = req.body;

  let settings = await Admin.findOne({ adminUser: req.user._id });

  if (!settings) {
    settings = await Admin.create({ adminUser: req.user._id });
  }

  if (banner !== undefined) {
    settings.banner = (Array.isArray(banner) ? banner : [])
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        title: item.title || "",
        imageUrl: item.imageUrl || "",
        link: item.link || "",
      }));
  }

  if (categories !== undefined) {
    settings.categories = [...new Set((Array.isArray(categories) ? categories : [])
      .map((category) => String(category).trim())
      .filter(Boolean))];
  }

  const updatedSettings = await settings.save();
  res.status(200).json(updatedSettings);
});

const promoteUserToAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("email is required.");
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  user.role = "admin";
  await user.save();

  await Admin.findOneAndUpdate(
    { adminUser: user._id },
    { adminUser: user._id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ message: "User promoted to admin successfully." });
});

const bootstrapFirstAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, setupKey } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("name, email, and password are required.");
  }

  if (process.env.ADMIN_SETUP_KEY && setupKey !== process.env.ADMIN_SETUP_KEY) {
    res.status(401);
    throw new Error("Invalid setup key.");
  }

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    res.status(409);
    throw new Error("An admin already exists. Use /api/admin/promote instead.");
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    res.status(409);
    throw new Error("A user with this email already exists.");
  }

  const adminUser = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: "admin",
  });

  await Admin.create({ adminUser: adminUser._id });

  const token = generateToken({ id: adminUser._id, role: adminUser.role });

  res.status(201).json({
    message: "First admin created successfully.",
    token,
    user: {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    },
  });
});

module.exports = {
  getAdminSummary,
  getAdminSettings,
  upsertAdminSettings,
  promoteUserToAdmin,
  bootstrapFirstAdmin,
};
