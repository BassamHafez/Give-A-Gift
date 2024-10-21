const Color = require("../models/colorModel");
const ProColor = require("../models/proColorModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.getAllColors = catchAsync(async (req, res, next) => {
  const [colors, proColors] = await Promise.all([
    Color.find().lean(),
    ProColor.find().lean(),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      colors,
      proColors,
    },
  });
});

exports.createColor = factory.createOne(Color);
exports.deleteColor = factory.deleteOne(Color);
