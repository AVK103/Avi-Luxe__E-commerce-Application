const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "title mainImg price discount category sizes"
  );

  if (!cart) {
    return res.status(200).json({ user: req.user._id, items: [] });
  }

  return res.status(200).json(cart);
});

const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, size, quantity = 1 } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("productId is required.");
  }

  const normalizedQuantity = Number(quantity);
  if (normalizedQuantity < 1) {
    res.status(400);
    throw new Error("quantity must be at least 1.");
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error("Product not found.");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      (item.size || "").toLowerCase() === (size || "").toLowerCase()
  );

  if (existingItem) {
    existingItem.quantity += normalizedQuantity;
  } else {
    cart.items.push({
      product: product._id,
      title: product.title,
      description: product.description,
      mainImg: product.mainImg,
      size: size || "",
      quantity: normalizedQuantity,
      price: product.price,
      discount: product.discount,
    });
  }

  const updatedCart = await cart.save();
  res.status(200).json(updatedCart);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity, size } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found.");
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error("Cart item not found.");
  }

  if (quantity !== undefined) {
    const normalizedQuantity = Number(quantity);
    if (normalizedQuantity < 1) {
      res.status(400);
      throw new Error("quantity must be at least 1.");
    }
    item.quantity = normalizedQuantity;
  }

  if (size !== undefined) {
    item.size = size;
  }

  const updatedCart = await cart.save();
  res.status(200).json(updatedCart);
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found.");
  }

  const initialCount = cart.items.length;
  cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);

  if (cart.items.length === initialCount) {
    res.status(404);
    throw new Error("Cart item not found.");
  }

  const updatedCart = await cart.save();
  res.status(200).json(updatedCart);
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(200).json({ message: "Cart already empty." });
  }

  cart.items = [];
  await cart.save();

  return res.status(200).json({ message: "Cart cleared successfully." });
});

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
