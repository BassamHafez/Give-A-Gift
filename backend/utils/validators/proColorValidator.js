const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createColorValidator = [
  check("image").notEmpty().withMessage("Image is required"),

  validatorMiddleware,
];

exports.deleteColorValidator = [
  check("id")
    .notEmpty()
    .withMessage("Color id is required")
    .isMongoId()
    .withMessage("Invalid color id"),

  validatorMiddleware,
];
