const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    isSpecial: {
      type: Boolean,
      default: false,
    },
    code: String,
    color: {
      type: mongoose.Schema.ObjectId,
      ref: "Color",
    },
    proColor: {
      type: mongoose.Schema.ObjectId,
      ref: "ProColor",
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
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    priceAfterDiscount: Number,
    price: {
      value: {
        type: Number,
        required: true,
      },
      fontFamily: String,
      fontSize: Number,
      fontColor: String,
      fontWeight: Number,
    },
    text: {
      message: String,
      fontFamily: String,
      fontSize: Number,
      fontColor: String,
      fontWeight: Number,
      xPosition: Number,
      yPosition: Number,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    recipient: {
      name: String,
      whatsappNumber: String,
    },
    receiveAt: Date,
    celebrateIcon: String,
    celebrateQR: String,
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
