const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Card = require("../models/cardModel");
const Config = require("../models/configModel");
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
  const { amount, receiverEmail } = req.body;

  if (req.user.email === receiverEmail) {
    return next(new ApiError("Cannot transfer to yourself", 400));
  }

  const receiver = await User.findOne({
    email: receiverEmail,
  });

  if (!receiver) {
    return next(new ApiError("No user found with that email", 404));
  }

  const [senderWallet, receiverWallet] = await Promise.all([
    Wallet.findOne({ user: req.user.id }),
    Wallet.findOne({ user: receiver.id }),
  ]);

  if (!senderWallet || !receiverWallet) {
    return next(new ApiError("Sender or Receiver not found", 404));
  }

  if (senderWallet.balance < amount) {
    return next(new ApiError("Insufficient balance", 400));
  }

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  await Promise.all([senderWallet.save(), receiverWallet.save()]);

  res.status(200).json({
    status: "success",
    data: senderWallet,
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

  if (wallet.balance < card.price.value) {
    return next(new ApiError("Insufficient balance", 400));
  }

  wallet.balance -= card.price.value;
  card.isPaid = true;

  await Promise.all([wallet.save(), card.save()]);

  res.status(200).json({
    status: "success",
    data: {
      wallet,
      card,
    },
  });
});

// ADMIN

exports.getAllWallets = factory.getAll(Wallet, [
  {
    path: "user",
    select: "name email photo phone",
  },
]);

exports.getUserWallet = factory.getOne(Wallet, [
  {
    path: "user",
    select: "name email photo phone",
  },
]);

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
