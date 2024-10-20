const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createSlideValidator = [
  check("order")
    .notEmpty()
    .withMessage("Order is required")
    .isNumeric()
    .withMessage("Order must be a number"),

  validatorMiddleware,
];

exports.updateSlideValidator = [
  check("id")
    .notEmpty()
    .withMessage("Slide ID is required")
    .isMongoId()
    .withMessage("Invalid Slide ID"),

  check("order").optional().isNumeric().withMessage("Order must be a number"),

  validatorMiddleware,
];

exports.deleteSlideValidator = [
  check("id")
    .notEmpty()
    .withMessage("Slide ID is required")
    .isMongoId()
    .withMessage("Invalid Slide ID"),

  validatorMiddleware,
];
