const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const Shop = require("../models/shopModel");
const SpecialCard = require("../models/SpecialCardModel");
const Config = require("../models/configModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { uploadMixOfImages } = require("../utils/uploadImage");
const { createJoinUsEmail } = require("../utils/shopUtils");
const sendEmail = require("../utils/sendEmail");
const { sendWhatsappText } = require("../utils/sendWhatsappMsg");

const shopPopulateOptions = [{ path: "category", select: "name icon" }];

exports.getAllShops = factory.getAll(Shop, shopPopulateOptions, "-token");

exports.getShop = catchAsync(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id)
    .select("-token")
    .populate(shopPopulateOptions)
    .lean();

  if (!shop) return next(new ApiError("No shop found with that ID", 404));

  const [readyCards, frontShapeImage, backShapeImage] = await Promise.all([
    SpecialCard.find({ shop: shop._id })
      .select("price priority")
      .sort("priority")
      .lean(),
    Config.findOne({ key: "SPECIAL_FRONT_SHAPE_PATH" }).lean(),
    Config.findOne({ key: "SPECIAL_BACK_SHAPE_PATH" }).lean(),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      shop,
      frontShapeImagePath: frontShapeImage?.value,
      backShapeImagePath: backShapeImage?.value,
      readyCards,
    },
  });
});

exports.getAllShopTokens = factory.getAll(Shop, [], "name token");

exports.getHomeShops = catchAsync(async (req, res, next) => {
  const shops = await Shop.find({ showInHome: true })
    .select("name logo link")
    .sort("priority")
    .lean();

  res.status(200).json({
    status: "success",
    results: shops.length,
    data: shops,
  });
});

exports.uploadShopLogos = uploadMixOfImages([
  { name: "logo", maxCount: 1 },
  { name: "cardLogo", maxCount: 1 },
]);

exports.resizeShopLogos = catchAsync(async (req, res, next) => {
  if (!req.files && req.method === "PATCH") return next();
  if (!req.files?.logo || !req.files?.cardLogo)
    return next(new ApiError("Please upload both logos", 400));

  const logoFilename = `shop-${uuidv4()}-${Date.now()}.png`;
  const cardLogoFilename = `shopCard-${uuidv4()}-${Date.now()}.png`;

  if (req.files.logo[0].buffer) {
    await sharp(req.files.logo[0].buffer)
      .toFormat("png")
      .png({ quality: 99 })
      .toFile(`uploads/shops/${logoFilename}`);
  }

  if (req.files.cardLogo[0].buffer) {
    await sharp(req.files.cardLogo[0].buffer)
      .toFormat("png")
      .png({ quality: 99 })
      .toFile(`uploads/shops/${cardLogoFilename}`);
  }

  req.body.logo = logoFilename;
  req.body.cardLogo = cardLogoFilename;

  next();
});

exports.createShop = factory.createOne(Shop);
exports.updateShop = factory.updateOne(Shop);
exports.deleteShop = factory.deleteOne(Shop);

exports.getTopShops = catchAsync(async (req, res, next) => {
  const shops = await Shop.aggregate([
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
        priorityInTopShops: 1,
      },
    },
    {
      $sort: { cardsCount: -1 },
    },
  ]);

  const sortedShops = [
    ...shops
      .filter((shop) => shop.priorityInTopShops > 0)
      .sort((a, b) => b.priorityInTopShops - a.priorityInTopShops),
    ...shops.filter(
      (shop) => !shop.priorityInTopShops || shop.priorityInTopShops <= 0
    ),
  ];

  res.status(200).json({
    status: "success",
    results: shops.length,
    data: sortedShops,
  });
});

exports.joinUs = catchAsync(async (req, res, next) => {
  // const { name, email, phone, description, link } = req.body;
  const joinUsEmail = createJoinUsEmail(req.body);

  await sendEmail(joinUsEmail);

  res.status(200).json({
    status: "success",
    message: "Your request has been sent successfully",
  });
});

exports.sendShopsMessages = catchAsync(async (req, res, next) => {
  const { message, type, shopsIds } = req.body;

  const shops = await Shop.find({ _id: { $in: shopsIds } })
    .select("phone email")
    .lean();

  if (!shops.length)
    return next(new ApiError("No shops found with that IDs", 404));

  if (type === "whatsapp") {
    shops.forEach((shop) => {
      sendWhatsappText(shop.phone, message);
    });
  } else if (type === "email") {
    shops.forEach((shop) => {
      sendEmail({
        email: shop.email,
        subject: "Give A Gift Website",
        text: message,
      });
    });
  } else {
    return next(new ApiError("Invalid message type", 400));
  }

  res.status(200).json({
    status: "success",
    message: "Messages have been sent successfully",
  });
});
