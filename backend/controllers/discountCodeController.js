const User = require("../models/userModel");
const Card = require("../models/cardModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllDiscountCodes = catchAsync(async (req, res, next) => {
  const merchant = await User.findById(req.user.id);

  const cards = await Card.find({ shop: merchant.merchantShop });

  const discountCodes = cards.map((card) => {
    return {
      id: card._id,
      recipient: card.recipient.name,
      isUsed: card.discountCode.isUsed,
      usedAt: card.discountCode.usedAt,
      isPaid: card.isPaid,
    };
  });

  res.status(200).json({
    status: "success",
    data: discountCodes,
  });
});

exports.getDiscountCodeValue = catchAsync(async (req, res, next) => {
  const cardId = req.params.cardId;
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

  const discountCode = {
    id: card._id,
    recipient: card.recipient.name,
    value: card.price.value,
  };

  card.discountCode.isUsed = true;
  card.discountCode.usedAt = Date.now();
  card.isDelivered = true;
  await card.save();

  res.status(200).json({
    status: "success",
    data: discountCode,
  });
});
