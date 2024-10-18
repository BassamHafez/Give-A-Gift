const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const Category = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { uploadSingleImage } = require("../utils/uploadImage");

exports.getAllCategories = factory.getAll(Category);

exports.uploadCategoryIcon = uploadSingleImage("icon");

exports.resizeCategoryIcon = catchAsync(async (req, res, next) => {
  if (!req.file && req.method === "PATCH") return next();
  if (!req.file) return next(new ApiError("Please upload an icon", 400));

  const filename = `category-${uuidv4()}-${Date.now()}.png`;

  await sharp(req.file.buffer)
    // .resize(100, 100)
    .toFormat("png")
    .png({ quality: 98 })
    .toFile(`uploads/categories/${filename}`);

  req.body.icon = filename;

  next();
});

exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
