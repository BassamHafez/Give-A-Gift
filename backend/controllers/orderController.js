const Order = require("../models/orderModel");
const Card = require("../models/cardModel");
const Wallet = require("../models/walletModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

exports.setUserId = (req, res, next) => {
  if (req.user.role !== "admin") req.query.customer_id = req.user.id;
  next();
};

exports.getAllOrders = factory.getAll(Order);

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    _id: id,
    ...(req.user.role !== "admin" && { customer_id: req.user.id }),
  });

  if (!order) {
    return next(new ApiError("No order found with that ID", 404));
  }

  const [card, userWallet] = await Promise.all([
    Card.findById(order.card_id),
    Wallet.findOne({ user: order.customer_id }),
  ]);

  if (!card) {
    return next(new ApiError("No corresponding code found", 404));
  }

  if (card.discountCode.isUsed) {
    return next(new ApiError("Code already used", 400));
  }

  userWallet.balance =
    parseFloat(userWallet.balance) + parseFloat(order.total_paid);

  await Promise.all([
    Order.findByIdAndDelete(id),
    Card.findByIdAndUpdate(order.card_id),
    userWallet.save(),
  ]);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
