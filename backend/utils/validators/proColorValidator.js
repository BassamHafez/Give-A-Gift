const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createColorValidator = [
  check("image").notEmpty().withMessage("Image is required"),

  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  check("priority")
    .optional()
    .isNumeric()
    .withMessage("Priority must be a number"),

  validatorMiddleware,
];

exports.updateColorValidator = [
  check("id")
    .notEmpty()
    .withMessage("Color id is required")
    .isMongoId()
    .withMessage("Invalid color id"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  check("priority")
    .optional()
    .isNumeric()
    .withMessage("Priority must be a number"),

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
