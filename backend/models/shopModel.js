const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
    },
    link: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

shopSchema.pre("save", function (next) {
  if (!this.token) {
    this.token = uuidv4();
  }
  next();
});

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
