const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createShopValidator = [
  check("name").isString().notEmpty().withMessage("Please provide a name"),

  check("logo").isString().notEmpty().withMessage("Please provide a logo"),

  validatorMiddleware,
];

exports.deleteShopValidator = [
  check("id").isMongoId().withMessage("Invalid shop id"),

  validatorMiddleware,
];
