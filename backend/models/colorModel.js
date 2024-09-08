const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    hex: {
      type: String,
      required: [true, "A color must have a hex value"],
    },
  },
  {
    timestamps: true,
  }
);

const Color = mongoose.model("Color", colorSchema);

module.exports = Color;
