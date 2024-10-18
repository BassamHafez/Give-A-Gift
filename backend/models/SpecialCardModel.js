const mongoose = require("mongoose");

const specialCardSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.ObjectId,
      ref: "Shop",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priority: {
      type: Number,
      default: 99999,
    },
  },
  {
    timestamps: true,
  }
);

const SpecialCard = mongoose.model("SpecialCard", specialCardSchema);

module.exports = SpecialCard;
