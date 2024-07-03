const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createCardValidator = [
  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  check("price")
    .notEmpty()
    .withMessage("Price of the card is required")
    .isNumeric()
    .withMessage("Price of the card must be a number"),

  check("shop")
    .notEmpty()
    .withMessage("Shop is required")
    .isMongoId()
    .withMessage("Shop must be a valid MongoDB ID"),

  check("color")
    .notEmpty()
    .withMessage("Color is required")
    .isHexColor()
    .withMessage("Color must be a valid hex color"),

  check("shape")
    .notEmpty()
    .withMessage("Shape is required")
    .isMongoId()
    .withMessage("Shape must be a valid MongoDB ID"),

  validatorMiddleware,
];

exports.getCardValidator = [
  check("id")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Card ID must be a valid MongoDB ID"),

  validatorMiddleware,
];

exports.updateCardValidator = [
  check("id")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Card ID must be a valid MongoDB ID"),

  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Price of the card must be a number"),

  check("shop")
    .optional()
    .isMongoId()
    .withMessage("Shop must be a valid MongoDB ID"),

  check("color")
    .optional()
    .isHexColor()
    .withMessage("Color must be a valid hex color"),

  check("shape")
    .optional()
    .isMongoId()
    .withMessage("Shape must be a valid MongoDB ID"),

  validatorMiddleware,
];

exports.deleteCardValidator = [
  check("id")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Card ID must be a valid MongoDB ID"),

  validatorMiddleware,
];
