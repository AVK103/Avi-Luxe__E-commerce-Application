const mongoose = require("mongoose");

const bannerItemSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    link: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const adminSchema = new mongoose.Schema(
  {
    adminUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    banner: { type: [bannerItemSchema], default: [] },
    categories: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
