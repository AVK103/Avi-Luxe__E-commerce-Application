const express = require("express");
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/items", protect, addItemToCart);
router.patch("/items/:itemId", protect, updateCartItem);
router.delete("/items/:itemId", protect, removeCartItem);
router.delete("/", protect, clearCart);

module.exports = router;
