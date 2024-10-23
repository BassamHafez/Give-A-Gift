const mongoose = require("mongoose");

const proColorSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
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

const ProColor = mongoose.model("ProColor", proColorSchema);

module.exports = ProColor;
