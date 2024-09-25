const QRCode = require("qrcode");
const Wallet = require("../models/walletModel");
const Card = require("../models/cardModel");
const Order = require("../models/orderModel");
const ScheduledMessage = require("../models/scheduledMessageModel");
const Transaction = require("../models/transactionModel");
const Config = require("../models/configModel");
const {
  calculateTotalCardPrice,
  createWhatsAppMessage,
  createOrderData,
} = require("../utils/cardUtils");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

exports.paymentWebhook = catchAsync(async (req, res, next) => {
  console.log("Webhook received 🎈🎉");

  try {
    const cardId = req.body?.UserDefinedField;

    if (!cardId) {
      throw new ApiError("Card ID not provided", 400);
    }

    if (req.body?.TransactionStatus === "SUCCESS") {
      console.log("Transaction SUCCESS");

      const cardPopOptions = [
        { path: "shop", select: "name isOnline" },
        { path: "shapes.shape", select: "image price" },
        { path: "proColor", select: "price" },
      ];

      const [card, wallet] = await Promise.all([
        Card.findById(cardId).populate(cardPopOptions),
        Wallet.findOne({ email: req.body.Data.CustomerEmail }),
      ]);

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

      const configKeys = [
        "VAT_VALUE",
        "CELEBRATE_ICON_PRICE",
        "CELEBRATE_LINK_PRICE",
        "CASH_BACK_PERCENTAGE",
      ];
      const configs = await Config.find({ key: { $in: configKeys } });
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

      const totalBalance =
        parseFloat(wallet.balance) +
        parseFloat(req.body?.Data?.InvoiceValueInBaseCurrency);

      if (totalBalance < totalAmount) {
        throw new ApiError("Insufficient balance", 400);
      }

      const newBalance = totalBalance - totalAmount || 0;

      wallet.balance = newBalance;
      card.isPaid = true;
      card.totalPricePaid = totalAmount;
      wallet.balance +=
        card.price.value * (parseFloat(cashBackPercentage) / 100);

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

      await Promise.all([
        wallet.save(),
        card.save(),
        Order.create(orderData),
        ScheduledMessage.create(msgData),
      ]);
    } else {
      console.log("Transaction FAILED");
    }
  } catch (error) {
    console.log(error);
  } finally {
    Transaction.create({
      ...req.body?.Data,
      InvoiceValue: req.body?.Data?.InvoiceValueInBaseCurrency,
    });
  }

  res.status(200).json({ status: "success" });
});

/*
// example
{
  EventType: 1,
  Event: 'TransactionsStatusChanged',
  DateTime: '31082024003443',
  CountryIsoCode: 'SAU',
  Data: {
    InvoiceId: 35434084,
    InvoiceReference: '2024000320',
    CreatedDate: '31082024003113',
    CustomerReference: null,
    CustomerName: 'Ammar Yasser',
    CustomerMobile: '+966',
    CustomerEmail: 'ammar.yassr.33@gmail.com',
    TransactionStatus: 'FAILED',
    PaymentMethod: 'VISA/MASTER',
    UserDefinedField: 'DEPOSIT',
    ReferenceId: '0808354340843455990283',
    TrackId: '31-08-2024_34559902',
    PaymentId: '0808354340843455990283',
    AuthorizationId: '0808354340843455990283',
    InvoiceValueInBaseCurrency: '81',
    BaseCurrency: 'SAR',
    InvoiceValueInDisplayCurreny: '81',
    DisplayCurrency: 'SAR',
    InvoiceValueInPayCurrency: '81',
    PayCurrency: 'SAR'
  }
}
*/
