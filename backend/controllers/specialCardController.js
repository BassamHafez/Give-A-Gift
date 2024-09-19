const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const SpecialCard = require("../models/SpecialCardModel");
const Shape = require("../models/shapeModel");
const Config = require("../models/configModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const { uploadMixOfImages } = require("../utils/uploadImage");

exports.createCard = factory.createOne(SpecialCard);
exports.updateCard = factory.updateOne(SpecialCard);
exports.deleteCard = factory.deleteOne(SpecialCard);

exports.getAllCards = catchAsync(async (req, res, next) => {
  const [cards, frontShape, backShape] = await Promise.all([
    SpecialCard.find().populate({ path: "shop", select: "name logo" }),
    Config.findOne({ key: "SPECIAL_FRONT_SHAPE_ID" }),
    Config.findOne({ key: "SPECIAL_BACK_SHAPE_ID" }),
  ]);

  console.log("frontShape :>> ", frontShape);
  console.log("backShape :>> ", backShape);

  const [frontShapeData, backShapeData] = await Promise.all([
    Shape.findById(frontShape.value),
    Shape.findById(backShape.value),
  ]);

  console.log("frontShapeData :>> ", frontShapeData);
  console.log("backShapeData :>> ", backShapeData);

  res.status(200).json({
    status: "success",
    results: cards.length,
    data: {
      frontShape: frontShapeData.image,
      backShape: backShapeData.image,
      cards,
    },
  });
});

exports.uploadSpecialCardImages = uploadMixOfImages([
  { name: "frontShapeImage", maxCount: 1 },
  { name: "backShapeImage", maxCount: 1 },
]);

exports.updateSpecialShapes = catchAsync(async (req, res, next) => {
  let frontShapeImagePath = null;
  let backShapeImagePath = null;

  if (req.files?.frontShapeImage) {
    const filename = `front-${uuidv4()}-${Date.now()}.png`;

    await sharp(req.files.frontShapeImage[0].buffer)
      .toFormat("png")
      .png({ quality: 98 })
      .toFile(`uploads/specialCards/${filename}`);

    await Config.findOneAndUpdate(
      { key: "SPECIAL_FRONT_SHAPE_PATH" },
      { value: `/specialCards/${filename}` }
    );

    frontShapeImagePath = `/specialCards/${filename}`;
  }

  if (req.files?.backShapeImage) {
    const filename = `back-${uuidv4()}-${Date.now()}.png`;

    await sharp(req.files.backShapeImage[0].buffer)
      .toFormat("png")
      .png({ quality: 98 })
      .toFile(`uploads/specialCards/${filename}`);

    await Config.findOneAndUpdate(
      { key: "SPECIAL_BACK_SHAPE_PATH" },
      { value: `/specialCards/${filename}` }
    );

    backShapeImagePath = `/specialCards/${filename}`;
  }

  res.status(200).json({
    status: "success",
    data: {
      ...(frontShapeImagePath && { frontShapeImagePath }),
      ...(backShapeImagePath && { backShapeImagePath }),
    },
  });
});
