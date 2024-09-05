const mongoose = require("mongoose");

const textSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    fontFamily: {
      type: String,
      required: true,
    },
    fontSize: {
      type: Number,
      required: true,
    },
    fontColor: {
      type: String,
      required: true,
    },
    fontWeight: Number,
    xPosition: {
      type: Number,
      required: true,
    },
    yPosition: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Text = mongoose.model("Text", textSchema);

module.exports = Text;
