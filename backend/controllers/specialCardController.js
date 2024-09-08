const SpecialCard = require("../models/SpecialCardModel");
const Shape = require("../models/shapeModel");
const Config = require("../models/configModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.createCard = factory.createOne(SpecialCard);
exports.updateCard = factory.updateOne(SpecialCard);
exports.deleteCard = factory.deleteOne(SpecialCard);

exports.getAllCards = catchAsync(async (req, res, next) => {
  const [cards, frontShape, backShape] = await Promise.all([
    SpecialCard.find().populate({ path: "shop", select: "name logo" }),
    Config.findOne({ key: "SPECIAL_FRONT_SHAPE_ID" }),
    Config.findOne({ key: "SPECIAL_BACK_SHAPE_ID" }),
  ]);

  const [frontShapeData, backShapeData] = await Promise.all([
    Shape.findById(frontShape.value),
    Shape.findById(backShape.value),
  ]);

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
