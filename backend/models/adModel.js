const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    enum: ["small", "large"],
  },
});

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
