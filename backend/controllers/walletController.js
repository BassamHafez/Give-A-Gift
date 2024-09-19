const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Card = require("../models/cardModel");
const ProColor = require("../models/proColorModel");
const Config = require("../models/configModel");
const ScheduledMessage = require("../models/scheduledMessageModel");
const factory = require("./handlerFactory");
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

  const [wallet, card] = await Promise.all([
    Wallet.findOne({ user: req.user.id }),
    Card.findById(cardId),
  ]);

  if (!card) {
    return next(new ApiError("Card not found", 404));
  }

  if (card.isPaid) {
    return next(new ApiError("Card already paid", 400));
  }

  if (
    !card.recipient ||
    !card.recipient.whatsappNumber ||
    !card.recipient.name
  ) {
    return next(new ApiError("Complete recipient details first", 400));
  }

  if (!wallet) {
    return next(new ApiError("Wallet not found", 404));
  }

  const VAT = await Config.findOne({ key: "VAT_VALUE" });

  let cardPrice =
    card?.priceAfterDiscount >= 0 ? card.priceAfterDiscount : card.price.value;

  if (card.proColor) {
    const proColor = await ProColor.findById(card.proColor);
    cardPrice += parseFloat(proColor.price);
  }

  const totalAmount = cardPrice + cardPrice * parseFloat(VAT.value / 100);

  if (parseFloat(wallet.balance) < totalAmount) {
    return next(new ApiError("Insufficient balance", 400));
  }

  wallet.balance -= totalAmount;
  card.isPaid = true;

  const msgData = {
    phone: card.recipient.whatsappNumber,
    caption: `You have received a gift card from ${req.user.name}. Click here to view: https://example.com/cards/previw/${card.id}`,
    fileUrl:
      "https://nypost.com/wp-content/uploads/sites/2/2023/11/gift-card.jpg",
    scheduledAt: new Date(card.receiveAt),
  };

  await Promise.all([
    wallet.save(),
    card.save(),
    ScheduledMessage.create(msgData),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      wallet,
      card,
    },
  });
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
