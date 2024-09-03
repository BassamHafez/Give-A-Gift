const mongoose = require("mongoose");

const shapeSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Shape = mongoose.model("Shape", shapeSchema);

module.exports = Shape;
