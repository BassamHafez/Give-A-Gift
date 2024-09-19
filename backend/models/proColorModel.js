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
  },
  {
    timestamps: true,
  }
);

const ProColor = mongoose.model("ProColor", proColorSchema);

module.exports = ProColor;
