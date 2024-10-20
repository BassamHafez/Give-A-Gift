const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Slide = mongoose.model("Slide", slideSchema);

module.exports = Slide;
