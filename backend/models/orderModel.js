const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  order_number: { type: Number, unique: true },
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
  shapes_price: Number,
  celebrate_icon_price: Number,
  celebrate_qr_link_price: Number,
  VAT: String,
  total_paid: Number,
  shop: String,
  order_date: Date,
  recipient_name: String,
  recipient_whatsapp: String,
});

/*
orderSchema.pre("save", async function (next) {
  const order = this;

  if (!order.isNew) return next();

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "order_number" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    order.order_number = counter.seq;
    next();
  } catch (err) {
    next(err);
  }
});
*/

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
