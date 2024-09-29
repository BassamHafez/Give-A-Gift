const QRCode = require("qrcode");
const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Card = require("../models/cardModel");
const Order = require("../models/orderModel");
const Counter = require("../models/counterModel");
const ScheduledMessage = require("../models/scheduledMessageModel");
const Transaction = require("../models/transactionModel");
const Config = require("../models/configModel");
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

exports.paymentWebhook = catchAsync(async (req, res, next) => {
  console.log("Webhook received 🎈🎉");

  try {
    const cardId = req.body?.Data?.UserDefinedField;

    if (!cardId) {
      throw new ApiError(
        `Card ID not provided for invoice ${req.body?.Data?.InvoiceId}.
        User: ${req.body?.Data?.CustomerName} - ${req.body?.Data?.CustomerMobile}`,
        400
      );
    }

    if (req.body?.Data?.TransactionStatus === "SUCCESS") {
      console.log("Transaction SUCCESS");

      const cardPopOptions = [
        { path: "shop", select: "name isOnline" },
        { path: "shapes.shape", select: "image price" },
        { path: "proColor", select: "price" },
      ];

      const card = await Card.findById(cardId).populate(cardPopOptions);

      if (!card) {
        throw new ApiError(
          `No card found with ID ${cardId}, for invoice ${req.body?.Data?.InvoiceId}.
          User: ${req.body?.Data?.CustomerName} - ${req.body?.Data?.CustomerMobile}`,
          404
        );
      }

      if (card.isPaid) {
        throw new ApiError(
          `Card ${card.id} already paid for invoice ${req.body?.Data?.InvoiceId}.
          User: ${req.body?.Data?.CustomerName} - ${req.body?.Data?.CustomerMobile}`,
          400
        );
      }

      if (
        !card.recipient ||
        !card.recipient.whatsappNumber ||
        !card.recipient.name
      ) {
        throw new ApiError(
          `Recipient details not complete for card ${card.id}, for invoice ${req.body?.Data?.InvoiceId}.
          User: ${req.body?.Data?.CustomerName} - ${req.body?.Data?.CustomerMobile}`,
          400
        );
      }

      const [wallet, user] = await Promise.all([
        Wallet.findOne({ user: card.user }),
        User.findById(card.user).select("name email phone"),
      ]);

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

      const totalBalance =
        parseFloat(wallet.balance) +
        parseFloat(req.body?.Data?.InvoiceValueInBaseCurrency);

      if (totalBalance < totalAmount) {
        throw new ApiError(
          `Insufficient balance for card ${card.id}, for invoice ${req.body?.Data?.InvoiceId}.
          User: ${req.body?.Data?.CustomerName} - ${req.body?.Data?.CustomerMobile}`,
          400
        );
      }

      let newBalance =
        totalBalance - totalAmount > 0 ? totalBalance - totalAmount : 0;
      newBalance += card.price.value * (parseFloat(cashBackPercentage) / 100);

      wallet.balance = newBalance;
      card.isPaid = true;
      card.paidAt = new Date();
      card.totalPricePaid = totalAmount;
      card.orderNumber = counter.seq;

      if (!card.shop.isOnline) {
        const qrCodeLink = `${process.env.QR_CODE_URL}/${card.id}`;

        const qrCode = await QRCode.toDataURL(qrCodeLink, {
          errorCorrectionLevel: "M",
        });

        card.discountCode.qrCode = qrCode;
      } else {
        card.discountCode.code = card.id;
      }

      const msgData = await createCardWhatsappMessage(card, user);

      const orderData = createOrderData(
        counter.seq,
        card,
        user,
        totalAmount,
        VAT.value,
        iconPrice,
        linkPrice
      );

      const [, , order] = await Promise.all([
        wallet.save(),
        card.save(),
        Order.create(orderData),
        ScheduledMessage.create(msgData),
      ]);

      const emailData = createOrderConfirmEmailData(order);
      sendEmail(emailData);
    } else {
      console.log("Transaction FAILED");
    }
  } catch (error) {
    console.log(error);
    sendEmail({
      email: "Giveagift.sa@gmail.com",
      subject: "Payment Failed",
      text: JSON.stringify(error),
      html: `<pre>${JSON.stringify(error, null, 2)}</pre>`,
    });
  } finally {
    Transaction.create({
      ...req.body?.Data,
      InvoiceValue: req.body?.Data?.InvoiceValueInBaseCurrency,
    });
  }

  res.status(200).json({ status: "success" });
});

/*
// Example
req.body {
  EventType: 1,
  Event: 'TransactionsStatusChanged',
  DateTime: '29092024150120',
  CountryIsoCode: 'SAU',
  Data: {
    InvoiceId: 37002699,
    InvoiceReference: '2024000447',
    CreatedDate: '29092024145906',
    CustomerReference: null,
    CustomerName: 'Ammar Yasser',
    CustomerMobile: '+966',
    CustomerEmail: 'ammar.yassr.959@gmail.com',
    TransactionStatus: 'FAILED',
    PaymentMethod: 'VISA/MASTER',
    UserDefinedField: '66f94095eef4719b7f313def',
    ReferenceId: '0808370026993609545684',
    TrackId: '29-09-2024_36095456',
    PaymentId: '0808370026993609545684',
    AuthorizationId: '0808370026993609545684',
    TrackId: '29-09-2024_36095456',
    PaymentId: '0808370026993609545684',
    AuthorizationId: '0808370026993609545684',
    PaymentId: '0808370026993609545684',
    AuthorizationId: '0808370026993609545684',
    AuthorizationId: '0808370026993609545684',
    InvoiceValueInBaseCurrency: '30',
    BaseCurrency: 'SAR',
    BaseCurrency: 'SAR',
    InvoiceValueInDisplayCurreny: '30',
    InvoiceValueInDisplayCurreny: '30',
    DisplayCurrency: 'SAR',
    InvoiceValueInPayCurrency: '30',
    PayCurrency: 'SAR'
  }
}
*/
