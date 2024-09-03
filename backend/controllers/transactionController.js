const Transaction = require("../models/transactionModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find();

  res.status(200).json({
    status: "success",
    results: transactions.length,
    data: transactions,
  });
});

exports.getTotalSuccessfulInvoiceValue = catchAsync(async (req, res, next) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        TransactionStatus: "SUCCESS",
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: { $toDouble: "$InvoiceValue" },
        },
      },
    },
  ]);

  const totalValue = result.length > 0 ? result[0].total : 0;

  res.status(200).json({
    status: "success",
    data: {
      totalValue,
    },
  });
});
