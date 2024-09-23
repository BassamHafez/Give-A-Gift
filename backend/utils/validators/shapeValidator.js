const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createShapeValidator = [
  check("image").isString().notEmpty().withMessage("Please provide an image"),

  check("position.x")
    .notEmpty()
    .withMessage("Please provide a position x value")
    .isNumeric()
    .withMessage("Position x must be a number"),

  check("position.y")
    .notEmpty()
    .withMessage("Please provide a position y value")
    .isNumeric()
    .withMessage("Position y must be a number"),

  check("scale")
    .notEmpty()
    .withMessage("Please provide a scale value for the shape")
    .isNumeric()
    .withMessage("Scale must be a number"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Please provide a valid price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

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
