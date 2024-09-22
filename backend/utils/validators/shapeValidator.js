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

  validatorMiddleware,
];

exports.deleteShapeValidator = [
  check("id").isMongoId().withMessage("Please provide a valid shape ID"),

  validatorMiddleware,
];
