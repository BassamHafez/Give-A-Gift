const mongoose = require("mongoose");
const Card = require("../models/cardModel");
const Config = require("../models/configModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const filter =
    req.user.role !== "admin"
      ? { user: new mongoose.Types.ObjectId(req.user.id) }
      : {};

  const [VATConfig, iconPriceConfig, linkPriceConfig] = await Promise.all([
    Config.findOne({ key: "VAT_VALUE" }),
    Config.findOne({ key: "CELEBRATE_ICON_PRICE" }),
    Config.findOne({ key: "CELEBRATE_LINK_PRICE" }),
  ]);

  const VAT = +VATConfig?.value || 0;
  const iconPrice = +iconPriceConfig?.value || 0;
  const linkPrice = +linkPriceConfig?.value || 0;

  const orders = await Card.aggregate([
    { $match: { isPaid: true, ...filter } },

    // Step 2: Lookup and populate related fields (user, shop, proColor, etc.)
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" }, // Unwind because $lookup returns an array

    {
      $lookup: {
        from: "procolors",
        localField: "proColor",
        foreignField: "_id",
        as: "proColor",
      },
    },
    { $unwind: { path: "$proColor", preserveNullAndEmptyArrays: true } },
    // Optional: Add more lookups for other referenced models if needed (e.g., shop, shape)

    // Step 3: Project and calculate fields (e.g., total price, celebrate icon/link prices)
    {
      $project: {
        _id: 0,
        order_id: "$_id",
        customer: "$user.name",
        phone: "$user.phone",
        email: "$user.email",
        order_date: "$receiveAt",
        paid_at: "$paidAt",
        value: "$price.value",
        price_after_discount: "$priceAfterDiscount",
        color_price: { $ifNull: ["$proColor.price", 0] },
        celebrate_icon_price: {
          $cond: {
            if: { $gt: ["$celebrateIcon", null] },
            then: iconPrice,
            else: 0,
          },
        },
        celebrate_qr_link_price: {
          $cond: {
            if: { $gt: ["$celebrateQR", null] },
            then: linkPrice,
            else: 0,
          },
        },
        VAT: { $concat: [String(VAT), "%"] },
        total_paid: "$totalPricePaid",
        recipient: "$recipient.name",
        recipient_whatsapp: "$recipient.whatsappNumber",
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders,
  });
});
