const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",

      required: [true, "Wallet must belong to a user"],
    },

    balance: {
      type: Number,
      default: 0,
    },

    transfers: [
      {
        amount: Number,

        receiverName: String,
        receiverPhone: String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
