const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const Shape = require("../models/shapeModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { uploadSingleImage } = require("../utils/uploadImage");

exports.getAllShapes = factory.getAll(Shape);

exports.uploadShapeImage = uploadSingleImage("image");

exports.resizeShapeImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new ApiError("Please upload an image", 400));

  const filename = `shape-${uuidv4()}-${Date.now()}.png`;

  await sharp(req.file.buffer)
    // .resize(1000, 800)
    .toFormat("png")
    .png({ quality: 98 })
    .toFile(`uploads/shapes/${filename}`);

  req.body.image = `/shapes/${filename}`;

  next();
});

exports.createShape = factory.createOne(Shape);

exports.deleteShape = factory.deleteOne(Shape);
