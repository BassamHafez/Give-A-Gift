const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const Shop = require("../models/shopModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { uploadSingleImage } = require("../utils/uploadImage");

// middleware to remove token from response if not admin

const shopPopulateOptions = [{ path: "category", select: "name icon" }];

exports.getAllShops = factory.getAll(Shop, shopPopulateOptions);
exports.getShop = factory.getOne(Shop, shopPopulateOptions);

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
