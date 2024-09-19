const sharp = require("sharp");
const SpecialCard = require("../models/SpecialCardModel");
const Config = require("../models/configModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const { uploadMixOfImages } = require("../utils/uploadImage");

exports.createCard = factory.createOne(SpecialCard);
exports.updateCard = factory.updateOne(SpecialCard);
exports.deleteCard = factory.deleteOne(SpecialCard);

exports.getAllCards = catchAsync(async (req, res, next) => {
  const [cards, frontShapeImagePath, backShapeImagePath] = await Promise.all([
    SpecialCard.find().populate({ path: "shop", select: "name logo" }),
    Config.findOne({ key: "SPECIAL_FRONT_SHAPE_PATH" }),
    Config.findOne({ key: "SPECIAL_BACK_SHAPE_PATH" }),
  ]);

  res.status(200).json({
    status: "success",
    results: cards.length,
    data: {
      frontShapeImagePath: frontShapeImagePath?.value,
      backShapeImagePath: backShapeImagePath?.value,
      cards,
    },
  });
});

exports.uploadSpecialCardImages = uploadMixOfImages([
  { name: "frontShapeImage", maxCount: 1 },
  { name: "backShapeImage", maxCount: 1 },
]);

exports.updateSpecialShapes = catchAsync(async (req, res, next) => {
  const frontShapeName = "front-shape.webp";
  const backShapeName = "back-shape.webp";
  const frontShapeImagePath = `/specialCards/${frontShapeName}`;
  const backShapeImagePath = `/specialCards/${backShapeName}`;

  if (req.files?.frontShapeImage) {
    await sharp(req.files.frontShapeImage[0].buffer)
      .toFormat("webp")
      .webp({ quality: 99 })
      .toFile(`uploads/specialCards/${frontShapeName}`);
  }

  if (req.files?.backShapeImage) {
    await sharp(req.files.backShapeImage[0].buffer)
      .toFormat("webp")
      .webp({ quality: 99 })
      .toFile(`uploads/specialCards/${backShapeName}`);
  }

  res.status(200).json({
    status: "success",
    data: {
      frontShapeImagePath,
      backShapeImagePath,
    },
  });
});
