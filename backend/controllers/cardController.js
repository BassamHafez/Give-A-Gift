const QRCode = require("qrcode");
const Card = require("../models/cardModel");
const Coupon = require("../models/couponModel");
const Config = require("../models/configModel");
const { calculateTotalCardPrice } = require("../utils/cardUtils");
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
  { path: "shape", select: "image price" },
  { path: "color", select: "hex" },
  { path: "proColor", select: "image price" },
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

exports.addRecipientInfo = catchAsync(async (req, res, next) => {
  if (req.body.celebrateLink) {
    req.body.celebrateQR = await QRCode.toDataURL(req.body.celebrateLink, {
      errorCorrectionLevel: "M",
    });
  }

  const card = await Card.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate([
    { path: "shape", select: "price" },
    { path: "proColor", select: "price" },
  ]);

  if (!card) {
    return next(new ApiError("No card found with that ID", 404));
  }

  if (card.recipient?.name) {
    return next(new ApiError("This card already has a recipient", 400));
  }

  Object.assign(card, req.body);
  await card.save({ runValidators: true });

  res.status(200).json({
    status: "success",
    data: card,
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
    Card.findById(cardId).populate("shop shape proColor"),
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

  const configKeys = [
    "VAT_VALUE",
    "CELEBRATE_ICON_PRICE",
    "CELEBRATE_LINK_PRICE",
  ];
  const configs = await Config.find({ key: { $in: configKeys } });
  const VAT = configs.find((c) => c.key === "VAT_VALUE");
  const iconPrice = configs.find((c) => c.key === "CELEBRATE_ICON_PRICE").value;
  const linkPrice = configs.find((c) => c.key === "CELEBRATE_LINK_PRICE").value;

  const totalPrice = calculateTotalCardPrice(
    card,
    iconPrice,
    linkPrice,
    VAT,
    false
  );

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
