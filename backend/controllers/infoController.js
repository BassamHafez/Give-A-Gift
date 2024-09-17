const User = require("../models/userModel");
const Card = require("../models/cardModel");
const Shop = require("../models/shopModel");
const Shape = require("../models/shapeModel");
const Transaction = require("../models/transactionModel");
const catchAsync = require("../utils/catchAsync");

exports.getStatistics = catchAsync(async (req, res, next) => {
  const [
    cardsPaid,
    cardsNotPaid,
    usersCount,
    topThreeShapes,
    topThreeShops,
    lastMonthsIncome,
  ] = await Promise.all([
    Card.countDocuments({ isPaid: true }),
    Card.countDocuments({ isPaid: false }),
    User.countDocuments({ role: "user" }),
    Shape.aggregate([
      {
        $lookup: {
          from: "cards",
          localField: "_id",
          foreignField: "shape",
          as: "cards",
        },
      },
      {
        $project: {
          name: 1,
          cardsCount: { $size: "$cards" },
          image: 1,
        },
      },
      {
        $sort: { cardsCount: -1 },
      },
      {
        $limit: 3,
      },
    ]),
    Shop.aggregate([
      {
        $lookup: {
          from: "cards",
          localField: "_id",
          foreignField: "shop",
          as: "cards",
        },
      },
      {
        $project: {
          name: 1,
          logo: 1,
          cardsCount: { $size: "$cards" },
        },
      },
      {
        $sort: { cardsCount: -1 },
      },
      {
        $limit: 3,
      },
    ]),
    Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalIncome: { $sum: { $toDouble: "$InvoiceValue" } },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "January" },
                { case: { $eq: ["$_id.month", 2] }, then: "February" },
                { case: { $eq: ["$_id.month", 3] }, then: "March" },
                { case: { $eq: ["$_id.month", 4] }, then: "April" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "June" },
                { case: { $eq: ["$_id.month", 7] }, then: "July" },
                { case: { $eq: ["$_id.month", 8] }, then: "August" },
                { case: { $eq: ["$_id.month", 9] }, then: "September" },
                { case: { $eq: ["$_id.month", 10] }, then: "October" },
                { case: { $eq: ["$_id.month", 11] }, then: "November" },
                { case: { $eq: ["$_id.month", 12] }, then: "December" },
              ],
              default: "Unknown",
            },
          },
          totalIncome: 1,
        },
      },
    ]),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      cardsPaid,
      cardsNotPaid,
      usersCount,
      topThreeShapes,
      topThreeShops,
      lastMonthsIncome,
    },
  });
});
