const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createSpecialCardValidator = [
  check("shop")
    .notEmpty()
    .withMessage("Shop is required")
    .isMongoId()
    .withMessage("Shop must be a valid MongoDB ID"),

  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a number greater than 0"),

  validatorMiddleware,
];

exports.getSpecialCardValidator = [
  check("id")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Card ID must be a valid MongoDB ID"),

  validatorMiddleware,
];

exports.updateSpecialCardValidator = [
  check("id")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Card ID must be a valid MongoDB ID"),

  check("shop")
    .optional()
    .isMongoId()
    .withMessage("Shop must be a valid MongoDB ID"),

  check("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be a number greater than 0"),

  validatorMiddleware,
];

exports.deleteSpecialCardValidator = [
  check("id")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Card ID must be a valid MongoDB ID"),

  validatorMiddleware,
];
