const mongoose = require("mongoose");

const fontSchema = new mongoose.Schema(
  {
    font: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Font = mongoose.model("Font", fontSchema);

module.exports = Font;
