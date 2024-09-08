const Color = require("../models/colorModel");
const factory = require("./handlerFactory");

exports.getAllColors = factory.getAll(Color);
exports.createColor = factory.createOne(Color);
exports.deleteColor = factory.deleteOne(Color);
