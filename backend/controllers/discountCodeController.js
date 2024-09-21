const User = require("../models/userModel");
const Card = require("../models/cardModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

exports.getAllDiscountCodes = catchAsync(async (req, res, next) => {
  const merchant = await User.findById(req.user.id);

  if (!merchant || !merchant.merchantShop) {
    return next(new ApiError("You do not have an associated shop", 404));
  }

  const discountCodes = await Card.aggregate([
    {
      $match: {
        shop: merchant.merchantShop,
      },
    },
    {
      $project: {
        id: "$_id",
        _id: 0,
        recipient: "$recipient.name",
        isUsed: "$discountCode.isUsed",
        usedAt: "$discountCode.usedAt",
        isPaid: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: discountCodes.length,
    data: discountCodes,
  });
});

exports.getDiscountCodeValue = catchAsync(async (req, res, next) => {
  const { cardId } = req.params;
  const card = await Card.findById(cardId);

  if (!card) {
    return next(new ApiError("Card not found", 404));
  }

  if (!card.isPaid) {
    return next(new ApiError("Card not paid", 400));
  }

  if (card.discountCode.isUsed) {
    return next(new ApiError("Discount code already used", 400));
  }

  await Card.findByIdAndUpdate(
    cardId,
    {
      $set: {
        "discountCode.isUsed": true,
        "discountCode.usedAt": Date.now(),
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      id: card._id,
      recipient: card.recipient.name,
      value: card.price.value,
    },
  });
});
