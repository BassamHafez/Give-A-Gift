const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createShapeValidator = [
  check("image").isString().notEmpty().withMessage("Please provide an image"),

  validatorMiddleware,
];

exports.deleteShapeValidator = [
  check("id").isMongoId().withMessage("Please provide a valid shape ID"),

  validatorMiddleware,
];
