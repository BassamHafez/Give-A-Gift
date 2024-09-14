const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createShopValidator = [
  check("name")
    .notEmpty()
    .withMessage("Shop name is required")
    .isString()
    .withMessage("Shop name must be a string"),

  check("logo").notEmpty().withMessage("Shop logo is required"),

  check("description")
    .notEmpty()
    .withMessage("Shop description is required")
    .isString()
    .withMessage("Shop description must be a string"),

  check("link").isURL().withMessage("Shop link must be a valid URL"),

  validatorMiddleware,
];

exports.deleteShopValidator = [
  check("id").isMongoId().withMessage("Invalid shop id"),

  validatorMiddleware,
];
