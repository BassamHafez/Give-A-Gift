const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createColorValidator = [
  check("hex")
    .notEmpty()
    .withMessage("Hex value is required")
    .isHexColor()
    .withMessage("Hex value must be a valid color"),

  validatorMiddleware,
];

exports.deleteColorValidator = [
  check("id")
    .notEmpty()
    .withMessage("Color ID is required")
    .isMongoId()
    .withMessage("Color ID is not valid"),

  validatorMiddleware,
];
