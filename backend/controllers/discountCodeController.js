const User = require("../models/userModel");
const Card = require("../models/cardModel");
const Config = require("../models/configModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { sendWhatsappText } = require("../utils/sendWhatsappMsg");

exports.getAllMerchantDiscountCodes = catchAsync(async (req, res, next) => {
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

  if (card.shop.toString() !== req.user.merchantShop.toString()) {
    return next(new ApiError("Card does not belong to your shop", 400));
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

exports.getAllDiscountCodes = catchAsync(async (req, res, next) => {
  const discountCodes = await Card.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        id: "$_id",
        _id: 0,
        user_id: "$user._id",
        user_name: "$user.name",
        recipient: "$recipient.name",
        isUsed: "$discountCode.isUsed",
        usedAt: "$discountCode.usedAt",
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: discountCodes.length,
    data: discountCodes,
  });
});

exports.sendDiscountCodeReminders = catchAsync(async (req, res, next) => {
  const { codesIds } = req.body;

  const [reminderMessage, codes] = await Promise.all([
    Config.findOne({ key: "UNUSED_CODE_REMINDER_MESSAGE" }).lean(),
    Card.find({
      _id: { $in: codesIds },
      isPaid: true,
      "discountCode.isUsed": false,
    })
      .select("recipient")
      .populate([{ path: "user", select: "phone" }])
      .lean(),
  ]);

  if (!codes.length) {
    return next(new ApiError("No paid and unused codes found", 404));
  }

  const message = reminderMessage.value;
  codes.forEach((code) =>
    sendWhatsappText(
      code.recipient?.whatsappNumber || code.user?.phone,
      message
    )
  );

  res.status(200).json({
    status: "success",
    data: null,
  });
});
