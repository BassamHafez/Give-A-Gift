const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  InvoiceId: String,
  InvoiceReference: String,
  CreatedDate: {
    type: Date,
    default: Date.now,
  },
  CustomerName: String,
  CustomerEmail: String,
  TransactionStatus: String,
  PaymentMethod: String,
  UserDefinedField: String,
  PaymentId: String,
  BaseCurrency: String,
  InvoiceValue: String,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
