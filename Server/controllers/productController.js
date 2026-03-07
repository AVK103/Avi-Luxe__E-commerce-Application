const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const normalizeListField = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeNumber = (value, fallback = 0) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const normalized = Number(value);
  return Number.isNaN(normalized) ? fallback : normalized;
};

const getProducts = asyncHandler(async (req, res) => {
  const { category, gender, search, minPrice, maxPrice } = req.query;
  const filter = { isActive: true };

  if (category) {
    filter.category = category;
  }

  if (gender) {
    filter.gender = gender;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.status(200).json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error("Product not found.");
  }

  res.status(200).json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    brand,
    mainImg,
    category,
    gender,
    sizes,
    carousel,
    price,
    discount,
    rating,
    ratingsCount,
    stock,
  } = req.body;

  if (!title || !description || !mainImg || !category || price === undefined) {
    res.status(400);
    throw new Error("title, description, mainImg, category, and price are required.");
  }

  const product = await Product.create({
    title,
    description,
    brand: brand || "Avi Luxe",
    mainImg,
    category,
    gender,
    sizes: normalizeListField(sizes),
    carousel: normalizeListField(carousel),
    price: normalizeNumber(price, 0),
    discount: normalizeNumber(discount, 0),
    rating: normalizeNumber(rating, 4.5),
    ratingsCount: normalizeNumber(ratingsCount, 0),
    stock: normalizeNumber(stock, 0),
    createdBy: req.user._id,
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  const {
    title,
    description,
    brand,
    mainImg,
    category,
    gender,
    sizes,
    carousel,
    price,
    discount,
    rating,
    ratingsCount,
    stock,
    isActive,
  } = req.body;

  if (title !== undefined) product.title = title;
  if (description !== undefined) product.description = description;
  if (brand !== undefined) product.brand = brand;
  if (mainImg !== undefined) product.mainImg = mainImg;
  if (category !== undefined) product.category = category;
  if (gender !== undefined) product.gender = gender;
  if (sizes !== undefined) product.sizes = normalizeListField(sizes);
  if (carousel !== undefined) product.carousel = normalizeListField(carousel);
  if (price !== undefined) product.price = normalizeNumber(price, product.price);
  if (discount !== undefined) product.discount = normalizeNumber(discount, product.discount);
  if (rating !== undefined) product.rating = normalizeNumber(rating, product.rating);
  if (ratingsCount !== undefined) product.ratingsCount = normalizeNumber(ratingsCount, product.ratingsCount);
  if (stock !== undefined) product.stock = normalizeNumber(stock, product.stock);
  if (isActive !== undefined) product.isActive = Boolean(isActive);

  const updatedProduct = await product.save();
  res.status(200).json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  product.isActive = false;
  await product.save();

  res.status(200).json({ message: "Product removed successfully." });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
