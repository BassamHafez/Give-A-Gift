const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createFontValidator = [
  check("font")
    .notEmpty()
    .withMessage("Font is required")
    .isString()
    .withMessage("Font must be a string"),

  validatorMiddleware,
];

exports.deleteFontValidator = [
  check("id")
    .notEmpty()
    .withMessage("Font ID is required")
    .isMongoId()
    .withMessage("Font ID is invalid"),

  validatorMiddleware,
];
