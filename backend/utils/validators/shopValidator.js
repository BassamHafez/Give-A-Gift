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

  check("isOnline")
    .optional()
    .isBoolean()
    .withMessage("Shop isOnline must be a boolean"),

  check("link")
    .if((value, { req }) => req.body.isOnline)
    .notEmpty()
    .withMessage("Shop link is required for online shops")
    .isURL()
    .withMessage("Shop link must be a valid URL"),

  validatorMiddleware,
];

exports.deleteShopValidator = [
  check("id")
    .notEmpty()
    .withMessage("Shop ID is required")
    .isMongoId()
    .withMessage("Shop ID must be a valid MongoDB ID"),

  validatorMiddleware,
];
