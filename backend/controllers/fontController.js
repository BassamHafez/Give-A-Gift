const Font = require("../models/fontModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.getAllFonts = factory.getAll(Font);
exports.createFont = factory.createOne(Font);
exports.deleteFont = factory.deleteOne(Font);
