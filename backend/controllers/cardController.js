const Card = require("../models/cardModel");
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

exports.getAllCards = factory.getAll(Card, [
  { path: "shop", select: "name logo" },
  { path: "shape", select: "image" },
  { path: "font", select: "font" },
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
