const express = require("express");
const {
  getAdminSummary,
  getAdminSettings,
  upsertAdminSettings,
  promoteUserToAdmin,
  bootstrapFirstAdmin,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/bootstrap", bootstrapFirstAdmin);
router.get("/summary", protect, adminOnly, getAdminSummary);
router.get("/settings", protect, adminOnly, getAdminSettings);
router.put("/settings", protect, adminOnly, upsertAdminSettings);
router.post("/promote", protect, adminOnly, promoteUserToAdmin);

module.exports = router;
