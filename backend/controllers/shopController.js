const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const Shop = require("../models/shopModel");
const SpecialCard = require("../models/SpecialCardModel");
const Config = require("../models/configModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { uploadSingleImage } = require("../utils/uploadImage");
const { createJoinUsEmail } = require("../utils/shopUtils");
const sendEmail = require("../utils/sendEmail");

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

exports.uploadShopLogo = uploadSingleImage("logo");

exports.resizeShopLogo = catchAsync(async (req, res, next) => {
  if (!req.file && req.method === "PATCH") return next();
  if (!req.file) return next(new ApiError("Please upload a logo", 400));

  const filename = `shop-${uuidv4()}-${Date.now()}.png`;

  await sharp(req.file.buffer)
    // .resize(1000, 800)
    .toFormat("png")
    .png({ quality: 98 })
    .toFile(`uploads/shops/${filename}`);

  // req.body.logo = `/shops/${filename}`;
  req.body.logo = filename;

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
        // cardsCount: { $size: "$cards" },
      },
    },
    {
      $sort: { cardsCount: -1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: shops.length,
    data: shops,
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
