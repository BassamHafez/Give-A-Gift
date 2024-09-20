const User = require("../models/userModel");
const Card = require("../models/cardModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllDiscountCodes = catchAsync(async (req, res, next) => {
  const merchant = await User.findById(req.user.id);

  const cards = await Card.find({ shop: merchant.merchantShop });

  const discountCodes = cards.map((card) => {
    return {
      recipient: card.recipient.name,
      isUsed: card.discountCode.isUsed,
      isPaid: card.isPaid,
    };
  });

  res.status(200).json({
    status: "success",
    data: discountCodes,
  });
});
