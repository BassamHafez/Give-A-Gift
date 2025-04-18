const mongoose = require("mongoose");

const shapeSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
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

const Shape = mongoose.model("Shape", shapeSchema);

module.exports = Shape;
