const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const ProColor = require("../models/proColorModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { uploadSingleImage } = require("../utils/uploadImage");

exports.uploadColorImage = uploadSingleImage("image");

exports.resizeColorImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new ApiError("Please upload an image", 400));

  const filename = `color-${uuidv4()}-${Date.now()}.png`;

  await sharp(req.file.buffer)
    // .resize(1000, 800)
    .toFormat("png")
    .png({ quality: 98 })
    .toFile(`uploads/colors/${filename}`);

  // req.body.image = `/colors/${filename}`;
  req.body.image = filename;

  next();
});

exports.createColor = factory.createOne(ProColor);

exports.deleteColor = factory.deleteOne(ProColor);

exports.updateColor = factory.updateOne(ProColor);
