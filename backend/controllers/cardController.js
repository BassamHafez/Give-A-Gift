const Card = require("../models/cardModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const sendWhatsappMsg = require("../utils/sendWhatsappMsg");

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.filterUserCards = (req, res, next) => {
  if (req.user.role !== "admin") req.query.user = req.user.id;
  next();
};

exports.getAllCards = factory.getAll(Card, [
  { path: "shop", select: "name logo" },
  { path: "shape", select: "image" },
  { path: "color", select: "hex" },
]);
exports.createCard = factory.createOne(Card);

exports.getCard = catchAsync(async (req, res, next) => {
  const doc = await Card.findOne({
    _id: req.params.id,
    ...(req.user.role !== "admin" && { user: req.user.id }),
  });

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

exports.sendCard = catchAsync(async (req, res, next) => {
  const { cardID } = req.body;

  const card = await Card.findById(cardID);

  if (!card) {
    return next(new ApiError("No card found with that ID", 404));
  }

  if (
    !card.recipient ||
    !card.recipient.whatsappNumber ||
    !card.recipient.name
  ) {
    return next(
      new ApiError("Please provide recipient name and whatsapp number", 400)
    );
  }

  if (!card.isPaid) {
    return next(new ApiError("Card is not paid yet", 400));
  }

  if (card.isDelivered) {
    return next(new ApiError("Card is already delivered", 400));
  }

  const message = `
  Hello ${card.recipient.name},
  ${card.text.message}
  `;
  const phone = card.recipient.whatsappNumber;

  await sendWhatsappMsg(phone, message);

  card.isDelivered = true;
  await card.save();

  res.status(200).json({
    status: "success",
    data: card,
  });
});
