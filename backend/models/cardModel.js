const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    shop: {
      type: mongoose.Schema.ObjectId,
      ref: "Shop",
      required: true,
    },
    shape: {
      type: mongoose.Schema.ObjectId,
      ref: "Shape",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      message: {
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
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
