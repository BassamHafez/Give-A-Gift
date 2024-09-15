const Card = require("../models/cardModel");
const Coupon = require("../models/couponModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.filterUserCards = (req, res, next) => {
  if (req.user.role !== "admin") req.query.user = req.user.id;
  next();
};

const cardPopulateOptions = [
  { path: "shop", select: "name logo" },
  { path: "shape", select: "image" },
  { path: "color", select: "hex" },
];

exports.getAllCards = factory.getAll(Card, cardPopulateOptions);
exports.createCard = factory.createOne(Card);

exports.getCard = catchAsync(async (req, res, next) => {
  const doc = await Card.findOne({
    _id: req.params.id,
    ...(req.user.role !== "admin" && { user: req.user.id }),
  }).populate(cardPopulateOptions);

  if (!doc) {
    return next(new ApiError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.updateCard = catchAsync(async (req, res, next) => {
  const doc = await Card.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!doc) {
    return next(new ApiError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.deleteCard = catchAsync(async (req, res, next) => {
  const doc = await Card.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!doc) {
    return next(new ApiError("No document found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { couponCode } = req.body;
  const cardId = req.params.id;

  const [coupon, card] = await Promise.all([
    Coupon.findOne({
      name: couponCode,
      expire: { $gt: Date.now() },
    }),
    Card.findById(cardId),
  ]);

  if (!card) {
    return next(new ApiError("No card found with that ID", 404));
  }

  if (!coupon) {
    return next(new ApiError("Coupon is invalid or expired", 400));
  }

  if (card.isPaid) {
    return next(new ApiError("Card is already paid", 400));
  }

  const totalPrice = card.price.value;
  card.priceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  await card.save();

  res.status(200).json({
    status: "success",
    data: card,
  });
});
