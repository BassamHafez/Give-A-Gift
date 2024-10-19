const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const Shop = require("../models/shopModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { uploadSingleImage } = require("../utils/uploadImage");

const shopPopulateOptions = [{ path: "category", select: "name icon" }];

exports.getAllShops = factory.getAll(Shop, shopPopulateOptions, "-token");
exports.getShop = factory.getOne(Shop, shopPopulateOptions, "-token");

exports.getAllShopTokens = factory.getAll(Shop, [], "name token");

exports.getHomeShops = catchAsync(async (req, res, next) => {
  const shops = await Shop.find({ showInHome: true })
    .select("name logo link")
    .sort("priority");

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
