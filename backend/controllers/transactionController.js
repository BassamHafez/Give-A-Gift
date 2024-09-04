const Transaction = require("../models/transactionModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.getAllTransactions = factory.getAll(Transaction);

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
