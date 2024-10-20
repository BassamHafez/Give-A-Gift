const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const Slide = require("../models/slideModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { uploadSingleImage } = require("../utils/uploadImage");

exports.getAllSlides = factory.getAll(Slide);

exports.uploadSlideImage = uploadSingleImage("image");

exports.resizeSlideImage = catchAsync(async (req, res, next) => {
  if (!req.file && req.method === "PATCH") return next();
  if (!req.file) return next(new ApiError("Please upload an image", 400));

  const filename = `slide-${uuidv4()}-${Date.now()}.png`;

  await sharp(req.file.buffer)
    // .resize(2000, 1333)
    .toFormat("png")
    .png({ quality: 98 })
    .toFile(`uploads/slides/${filename}`);

  // req.body.image = `/slides/${filename}`;
  req.body.image = filename;

  next();
});

exports.createSlide = factory.createOne(Slide);
exports.updateSlide = factory.updateOne(Slide);
exports.deleteSlide = factory.deleteOne(Slide);
