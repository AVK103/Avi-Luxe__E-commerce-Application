const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");

const normalizeAmount = (value) => Number(Number(value || 0).toFixed(2));

const calculatePrices = (items) => {
  const subtotal = normalizeAmount(
    items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
  );

  const discount = normalizeAmount(
    items.reduce(
      (sum, item) =>
        sum +
        ((Number(item.price) * Number(item.discount || 0)) / 100) *
          Number(item.quantity),
      0
    )
  );

  const total = normalizeAmount(Math.max(subtotal - discount, 0));

  return { subtotal, discount, total };
};

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("Order must contain at least one item.");
  }

  if (
    !shippingAddress ||
    !shippingAddress.name ||
    !shippingAddress.mobile ||
    !shippingAddress.address ||
    !shippingAddress.pincode
  ) {
    res.status(400);
    throw new Error("Complete shippingAddress is required.");
  }

  const normalizedItems = items.map((item) => {
    if (
      !item.title ||
      item.price === undefined ||
      item.quantity === undefined ||
      Number(item.quantity) < 1
    ) {
      res.status(400);
      throw new Error("Each order item must include title, price, and quantity.");
    }

    return {
      product: item.product || undefined,
      title: item.title,
      description: item.description || "",
      mainImg: item.mainImg || "",
      size: item.size || "",
      quantity: Number(item.quantity),
      price: Number(item.price),
      discount: Number(item.discount || 0),
    };
  });

  const prices = calculatePrices(normalizedItems);

  const order = await Order.create({
    user: req.user._id,
    items: normalizedItems,
    shippingAddress,
    paymentMethod: paymentMethod || "cod",
    prices,
  });

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to access this order.");
  }

  res.status(200).json(order);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email mobile")
    .sort({ createdAt: -1 });
  res.status(200).json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, deliveryDate } = req.body;
  const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  if (!status || !validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`status must be one of: ${validStatuses.join(", ")}`);
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  order.status = status;

  if (deliveryDate) {
    order.deliveryDate = deliveryDate;
  } else if (status === "delivered") {
    order.deliveryDate = new Date();
  }

  const updatedOrder = await order.save();
  res.status(200).json(updatedOrder);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
