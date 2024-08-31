const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Card = require("../models/cardModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

exports.getMyWallet = catchAsync(async (req, res, next) => {
  let wallet = await Wallet.findOne({ user: req.user.id });

  if (!wallet) {
    wallet = await Wallet.create({
      user: req.user.id,
      balance: 0,
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

  if (!wallet || !card) {
    return next(new ApiError("Wallet or Card not found", 404));
  }

  if (wallet.balance < card.price) {
    return next(new ApiError("Insufficient balance", 400));
  }

  wallet.balance -= card.price;
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

exports.getAllWallets = catchAsync(async (req, res, next) => {
  const wallets = await Wallet.find().populate({
    path: "user",
    select: "name email photo phone",
  });

  res.status(200).json({
    status: "success",
    results: wallets.length,
    data: wallets,
  });
});

exports.getUserWallet = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const wallet = await Wallet.findById(id).populate({
    path: "user",
    select: "name email photo phone",
  });

  if (!wallet) {
    return next(new ApiError("Wallet not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: wallet,
  });
});

exports.addBalanceToWallet = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { amountToIncrease } = req.body;

  const wallet = await Wallet.findById(id);

  if (!wallet) {
    return next(new ApiError("Wallet not found", 404));
  }

  wallet.balance += amountToIncrease;
  await wallet.save();

  res.status(200).json({
    status: "success",
    data: wallet,
  });
});
