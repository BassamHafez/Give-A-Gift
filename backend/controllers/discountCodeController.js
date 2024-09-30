const User = require("../models/userModel");
const Shop = require("../models/shopModel");
const Card = require("../models/cardModel");
const Order = require("../models/orderModel");
const Wallet = require("../models/walletModel");
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
      $lookup: {
        from: "shops",
        localField: "shop",
        foreignField: "_id",
        as: "shop",
      },
    },
    {
      $unwind: "$shop",
    },
    {
      $project: {
        id: "$_id",
        _id: 0,
        user_id: "$user._id",
        user_name: "$user.name",
        user_phone: "$user.phone",
        order_number: "$orderNumber",
        shop_id: "$shop._id",
        shop_name: "$shop.name",
        code_value: "$price.value",
        isPaid: 1,
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
    return res.status(200).json({ status: "success", data: null });
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

exports.cancelDiscountCode = catchAsync(async (req, res, next) => {
  const { cardId } = req.params;
  const card = await Card.findById(cardId);

  if (!card) {
    return next(new ApiError("No code with this ID", 404));
  }

  if (card.discountCode.isUsed) {
    return next(new ApiError("Code already used", 400));
  }

  const [order, userWallet, cashBackPercentage] = await Promise.all([
    Order.findOne({ order_number: card.orderNumber }),
    Wallet.findOne({ user: card.user }),
    Config.findOne({ key: "CASH_BACK_PERCENTAGE" }),
  ]);

  if (!order) {
    return next(new ApiError("No order found for this card", 404));
  }

  if (!userWallet) {
    return next(new ApiError("No wallet found for this user", 404));
  }

  userWallet.balance =
    parseFloat(userWallet.balance) +
    (parseFloat(order.total_paid) -
      card.price.value * (parseFloat(cashBackPercentage.value) / 100));

  await Promise.all([
    Card.findByIdAndDelete(cardId),
    Order.findByIdAndDelete(order._id),
    userWallet.save(),
  ]);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getOnlineDiscountCodeValue = catchAsync(async (req, res, next) => {
  const { token, code } = req.body;

  const [card, shop] = await Promise.all([
    Card.findById(code).select("price discountCode isPaid shop"),
    Shop.findOne({ token }),
  ]);

  if (!shop) {
    return next(new ApiError("Invalid token", 400));
  }

  if (!card) {
    return next(new ApiError("Invalid code", 400));
  }

  if (!card.isPaid) {
    return next(new ApiError("Card not paid", 400));
  }

  if (card.discountCode.isUsed) {
    return next(new ApiError("Code already used", 400));
  }

  if (card.shop.toString() !== shop._id.toString()) {
    return next(new ApiError("Code does not belong to this shop", 400));
  }

  await Card.findByIdAndUpdate(code, {
    $set: {
      "discountCode.isUsed": true,
      "discountCode.usedAt": Date.now(),
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      value: card.price.value,
    },
  });
});
