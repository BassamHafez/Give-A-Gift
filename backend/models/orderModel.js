const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  card_id: String,
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  customer_name: String,
  customer_email: String,
  customer_phone: String,
  paid_at: Date,
  value: Number,
  price_after_discount: Number,
  color_price: Number,
  shape_price: Number,
  shape2_price: Number,
  celebrate_icon_price: Number,
  celebrate_qr_link_price: Number,
  VAT: String,
  total_paid: Number,
  shop: String,
  order_date: Date,
  recipient_name: String,
  recipient_whatsapp: String,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
