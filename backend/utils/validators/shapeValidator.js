const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createShapeValidator = [
  check("image").isString().notEmpty().withMessage("Please provide an image"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Please provide a valid price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  check("priority")
    .optional()
    .isNumeric()
    .withMessage("Priority must be a number"),

  validatorMiddleware,
];

exports.updateShapeValidator = [
  check("id")
    .notEmpty()
    .withMessage("Please provide a shape ID")
    .isMongoId()
    .withMessage("Invalid shape ID"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Please provide a valid price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  check("priority")
    .optional()
    .isNumeric()
    .withMessage("Priority must be a number"),

  validatorMiddleware,
];

exports.deleteShapeValidator = [
  check("id")
    .notEmpty()
    .withMessage("Please provide a shape ID")
    .isMongoId()
    .withMessage("Invalid shape ID"),

  validatorMiddleware,
];
