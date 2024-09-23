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
    position: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
    scale: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Shape = mongoose.model("Shape", shapeSchema);

module.exports = Shape;
