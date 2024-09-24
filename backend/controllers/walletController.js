const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Card = require("../models/cardModel");
const Order = require("../models/orderModel");
const Config = require("../models/configModel");
const ScheduledMessage = require("../models/scheduledMessageModel");
const mongoose = require("mongoose");
const QRCode = require("qrcode");
const factory = require("./handlerFactory");
const {
  calculateTotalCardPrice,
  createWhatsAppMessage,
  createOrderData,
} = require("../utils/cardUtils");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

exports.getMyWallet = catchAsync(async (req, res, next) => {
  let wallet = await Wallet.findOne({ user: req.user.id });

  if (!wallet) {
    const STARTING_BALANCE = await Config.findOne({
      key: "WALLET_STARTING_BALANCE",
    });

    wallet = await Wallet.create({
      user: req.user.id,
      balance: +STARTING_BALANCE?.value || 0,
    });
  }

  res.status(200).json({
    status: "success",
    data: wallet,
  });
});

exports.transfer = catchAsync(async (req, res, next) => {
  const { amount, receiverPhone } = req.body;

  if (req.user.phone === receiverPhone) {
    return next(new ApiError("Cannot transfer to yourself", 400));
  }

  const receiver = await User.findOne({
    phone: receiverPhone,
  });

  if (!receiver) {
    return next(new ApiError("No user found with that phone number", 404));
  }

  const [senderWallet, receiverWallet] = await Promise.all([
    Wallet.findOne({ user: req.user.id }),
    Wallet.findOne({ user: receiver.id }),
  ]);

  if (!senderWallet || !receiverWallet) {
    return next(new ApiError("Sender or Receiver not found", 404));
  }

  if (parseFloat(senderWallet.balance) < amount) {
    return next(new ApiError("Insufficient balance", 400));
  }

  await Wallet.bulkWrite([
    {
      updateOne: {
        filter: { user: req.user.id },
        update: { $inc: { balance: -amount } },
      },
    },
    {
      updateOne: {
        filter: { user: receiver.id },
        update: { $inc: { balance: amount } },
      },
    },
  ]);

  const updatedSenderWallet = await Wallet.findOne({ user: req.user.id });

  res.status(200).json({
    status: "success",
    data: updatedSenderWallet,
  });
});

exports.buyCard = catchAsync(async (req, res, next) => {
  const { cardId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  const cardPopOptions = [
    { path: "shop", select: "name isOnline" },
    { path: "shape", select: "price" },
    { path: "shape2", select: "price" },
    { path: "proColor", select: "price" },
  ];

  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    const card = await Card.findById(cardId).populate(cardPopOptions);

    if (!card) {
      throw new ApiError("Card not found", 404);
    }

    if (card.isPaid) {
      throw new ApiError("Card already paid", 400);
    }

    if (
      !card.recipient ||
      !card.recipient.whatsappNumber ||
      !card.recipient.name
    ) {
      throw new ApiError("Complete recipient details first", 400);
    }

    if (!wallet) {
      throw new ApiError("Wallet not found", 404);
    }

    const configKeys = [
      "VAT_VALUE",
      "CELEBRATE_ICON_PRICE",
      "CELEBRATE_LINK_PRICE",
    ];
    const configs = await Config.find({ key: { $in: configKeys } });
    const VAT = configs.find((c) => c.key === "VAT_VALUE");
    const iconPrice = configs.find(
      (c) => c.key === "CELEBRATE_ICON_PRICE"
    ).value;
    const linkPrice = configs.find(
      (c) => c.key === "CELEBRATE_LINK_PRICE"
    ).value;

    const totalAmount = calculateTotalCardPrice(
      card,
      iconPrice,
      linkPrice,
      VAT
    );

    if (parseFloat(wallet.balance) < totalAmount) {
      throw new ApiError("Insufficient balance", 400);
    }

    wallet.balance -= totalAmount;
    card.isPaid = true;
    card.totalPricePaid = totalAmount;

    if (!card.shop.isOnline) {
      const qrCodeLink = `${process.env.QR_CODE_URL}/${card.id}`;

      const qrCode = await QRCode.toDataURL(qrCodeLink, {
        errorCorrectionLevel: "M",
      });

      card.discountCode.qrCode = qrCode;
    }
    // else { }

    const msgData = createWhatsAppMessage(card, req.user);

    const orderData = createOrderData(
      card,
      req.user,
      totalAmount,
      VAT.value,
      iconPrice,
      linkPrice
    );

    await wallet.save({ session });
    await card.save({ session });
    await ScheduledMessage.create([msgData], { session });
    await Order.create([orderData], { session });

    await session.commitTransaction();

    res.status(200).json({
      status: "success",
      // data: orderData,
      data: {
        card,
        wallet,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    return next(error);
  } finally {
    session.endSession();
  }
});

// ADMIN

const walletPopOptions = [
  {
    path: "user",
    select: "name email photo phone",
  },
];

exports.getAllWallets = factory.getAll(Wallet, walletPopOptions);

exports.getUserWallet = factory.getOne(Wallet, walletPopOptions);

exports.addBalanceToWallet = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { amountToIncrease } = req.body;

  const wallet = await Wallet.findByIdAndUpdate(
    id,
    { $inc: { balance: amountToIncrease } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: wallet,
  });
});

exports.addBalanceToAllWallets = catchAsync(async (req, res, next) => {
  const { amountToIncrease } = req.body;

  const result = await Wallet.updateMany(
    {},
    { $inc: { balance: amountToIncrease } }
  );

  res.status(200).json({
    status: "success",
    data: {
      modifiedCount: result.modifiedCount,
    },
  });
});
