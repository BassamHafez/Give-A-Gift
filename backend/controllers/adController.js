const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const AD = require("../models/adModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { uploadSingleImage } = require("../utils/uploadImage");

exports.getAllAds = factory.getAll(AD);

exports.uploadAdImage = uploadSingleImage("image");

exports.resizeAdImage = catchAsync(async (req, res, next) => {
  if (!req.file && req.method === "PATCH") return next();
  if (!req.file) return next(new ApiError("Please upload an image", 400));

  const filename = `ad-${uuidv4()}-${Date.now()}.png`;

  await sharp(req.file.buffer)
    // .resize(2000, 1333)
    .toFormat("png")
    .png({ quality: 98 })
    .toFile(`uploads/ads/${filename}`);

  // req.body.image = `/ads/${filename}`;
  req.body.image = filename;

  next();
});

exports.createAd = factory.createOne(AD);
exports.updateAd = factory.updateOne(AD);
exports.deleteAd = factory.deleteOne(AD);
