const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Card = require("../models/cardModel");
const Order = require("../models/orderModel");
const Counter = require("../models/counterModel");
const Config = require("../models/configModel");
const ScheduledMessage = require("../models/scheduledMessageModel");
const mongoose = require("mongoose");
const QRCode = require("qrcode");
const factory = require("./handlerFactory");
const {
  calculateTotalCardPrice,
  createCardWhatsappMessage,
} = require("../utils/cardUtils");
const {
  createOrderData,
  createOrderConfirmEmailData,
} = require("../utils/orderUtils");
const sendEmail = require("../utils/sendEmail");
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
  })
    .select("id name phone")
    .lean();

  if (!receiver) {
    return next(new ApiError("No user found with that phone number", 404));
  }

  const [senderWallet, receiverWallet] = await Promise.all([
    Wallet.findOne({ user: req.user.id }),
    Wallet.findOne({ user: receiver._id }),
  ]);

  if (!senderWallet || !receiverWallet) {
    return next(new ApiError("Sender or Receiver not found", 404));
  }

  if (parseFloat(senderWallet.balance) < amount) {
    return next(new ApiError("Insufficient balance", 400));
  }

  const transferData = {
    amount,
    receiverName: receiver.name,
    receiverPhone,
  };

  const [updatedSenderWallet, updatedReceiverWallet] = await Promise.all([
    Wallet.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          transfers: { $each: [transferData] },
        },
        $inc: { balance: -amount },
      },
      { new: true }
    ),
    Wallet.findOneAndUpdate(
      { user: receiver._id },
      { $inc: { balance: amount } }
    ),
  ]);

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
    { path: "shapes.shape", select: "image price" },
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
      "CASH_BACK_PERCENTAGE",
    ];
    const [configs, counter] = await Promise.all([
      Config.find({ key: { $in: configKeys } }),
      Counter.findOneAndUpdate(
        { name: "order_number" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      ),
    ]);

    const VAT = configs.find((c) => c.key === "VAT_VALUE");
    const iconPrice = configs.find(
      (c) => c.key === "CELEBRATE_ICON_PRICE"
    ).value;
    const linkPrice = configs.find(
      (c) => c.key === "CELEBRATE_LINK_PRICE"
    ).value;
    const cashBackPercentage = configs.find(
      (c) => c.key === "CASH_BACK_PERCENTAGE"
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
    card.paidAt = new Date();
    card.totalPricePaid = totalAmount;
    card.orderNumber = counter.seq;
    wallet.balance += card.price.value * (parseFloat(cashBackPercentage) / 100);

    if (!card.shop.isOnline) {
      const qrCodeLink = `${process.env.QR_CODE_URL}/${card.id}`;

      const qrCode = await QRCode.toDataURL(qrCodeLink, {
        errorCorrectionLevel: "M",
      });

      card.discountCode.qrCode = qrCode;
    } else {
      card.discountCode.code = card.id;
    }

    const msgData = await createCardWhatsappMessage(card, req.user);

    const orderData = createOrderData(
      counter.seq,
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
    const order = await Order.create([orderData], { session });

    const emailData = createOrderConfirmEmailData(order[0]);
    sendEmail(emailData);

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
    [
      {
        $set: {
          balance: {
            $max: [{ $add: ["$balance", amountToIncrease] }, 0],
          },
        },
      },
    ],
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: wallet,
  });
});

exports.addBalanceToAllWallets = catchAsync(async (req, res, next) => {
  const { amountToIncrease } = req.body;

  const result = await Wallet.updateMany({}, [
    {
      $set: {
        balance: {
          $max: [{ $add: ["$balance", amountToIncrease] }, 0],
        },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      modifiedCount: result.modifiedCount,
    },
  });
});
