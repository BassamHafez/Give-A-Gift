const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Card = require("../models/cardModel");
const ProColor = require("../models/proColorModel");
const Order = require("../models/orderModel");
const Config = require("../models/configModel");
const ScheduledMessage = require("../models/scheduledMessageModel");
const QRCode = require("qrcode");
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
    Card.findById(cardId).populate("shop shape"),
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

  const [VAT, iconPrice, linkPrice] = await Promise.all([
    Config.findOne({ key: "VAT_VALUE" }),
    Config.findOne({ key: "CELEBRATE_ICON_PRICE" }),
    Config.findOne({ key: "CELEBRATE_LINK_PRICE" }),
  ]);

  let cardPrice =
    card?.priceAfterDiscount >= 0 ? card.priceAfterDiscount : card.price.value;

  cardPrice += parseFloat(card.shape.price);
  let proColor;
  if (card.proColor) {
    proColor = await ProColor.findById(card.proColor);
    cardPrice += parseFloat(proColor.price);
  }
  if (card.celebrateIcon) {
    cardPrice += parseFloat(iconPrice.value);
  }
  if (card.celebrateQR) {
    cardPrice += parseFloat(linkPrice.value);
  }

  const totalAmount = cardPrice + cardPrice * parseFloat(VAT.value / 100);

  if (parseFloat(wallet.balance) < totalAmount) {
    return next(new ApiError("Insufficient balance", 400));
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

  const msgData = {
    phone: card.recipient.whatsappNumber,
    caption: `You have received a gift card from ${req.user.name}. Click here to view: https://example.com/cards/previw/${card.id}`,
    fileUrl:
      "https://nypost.com/wp-content/uploads/sites/2/2023/11/gift-card.jpg",
    scheduledAt: new Date(card.receiveAt),
  };

  const orderData = {
    card_id: card.id,
    customer_id: req.user.id,
    customer_name: req.user.name,
    customer_email: req.user.email,
    customer_phone: req.user.phone,
    value: card.price.value,
    price_after_discount: card.priceAfterDiscount,
    shape_price: card.shape.price,
    color_price: card.proColor ? parseFloat(proColor.price) : 0,
    celebrate_icon_price: card.celebrateIcon ? iconPrice.value : 0,
    celebrate_qr_link_price: card.celebrateQR ? linkPrice.value : 0,
    VAT: VAT.value,
    total_paid: totalAmount,
    order_date: card.receiveAt,
    recipient_name: card.recipient.name,
    recipient_whatsapp: card.recipient.whatsappNumber,
  };

  await Promise.all([
    wallet.save(),
    card.save(),
    ScheduledMessage.create(msgData),
    Order.create(orderData),
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
