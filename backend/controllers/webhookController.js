const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const Config = require("../models/configModel");
const catchAsync = require("../utils/catchAsync");

exports.paymentWebhook = catchAsync(async (req, res, next) => {
  console.log("Webhook received 🎈🎉");

  try {
    if (req.body?.TransactionStatus === "SUCCESS") {
      if (req.body?.UserDefinedField === "DEPOSIT") {
        console.log("Deposit successful");
      } else if (req.body?.UserDefinedField === "PAYMENT") {
        console.log("Payment successful");
      }

      const user = await User.findOne({ email: req.body.Data.CustomerEmail });
      let wallet = await Wallet.findOne({ user: user.id });

      if (!wallet) {
        const STARTING_BALANCE = await Config.findOne({
          key: "WALLET_STARTING_BALANCE",
        });

        wallet = await Wallet.create({
          user: user.id,
          balance: +STARTING_BALANCE?.value || 0,
        });
      }

      wallet.balance += req.body?.Data?.InvoiceValueInBaseCurrency * 1;
      await wallet.save();

      console.log("Wallet updated successfully");
    }

    Transaction.create({
      ...req.body?.Data,
      InvoiceValue: req.body?.Data?.InvoiceValueInBaseCurrency,
    });
  } catch (error) {
    console.log(error);
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
