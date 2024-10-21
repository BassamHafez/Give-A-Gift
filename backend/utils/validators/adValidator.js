const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createAdValidator = [
  check("image").notEmpty().withMessage("Image is required"),

  check("link")
    .notEmpty()
    .withMessage("Link is required")
    .isURL({
      allow_underscores: true,
      allow_trailing_dot: true,
      allow_numeric_tld: true,
      allow_wildcard: true,
      allow_protocol_relative_urls: true,
    })
    .withMessage("Link must be a valid URL"),

  check("order")
    .notEmpty()
    .withMessage("Order is required")
    .isNumeric()
    .withMessage("Order must be a number"),

  validatorMiddleware,
];

exports.updateAdValidator = [
  check("id")
    .notEmpty()
    .withMessage("Ad ID is required")
    .isMongoId()
    .withMessage("Ad ID must be a valid MongoDB ID"),

  check("image").optional().isString().withMessage("Image must be a string"),

  check("link")
    .optional()
    .isURL({
      allow_underscores: true,
      allow_trailing_dot: true,
      allow_numeric_tld: true,
      allow_wildcard: true,
      allow_protocol_relative_urls: true,
    })
    .withMessage("Link must be a valid URL"),

  check("order").optional().isNumeric().withMessage("Order must be a number"),

  validatorMiddleware,
];

exports.deleteAdValidator = [
  check("id")
    .notEmpty()
    .withMessage("Ad ID is required")
    .isMongoId()
    .withMessage("Ad ID must be a valid MongoDB ID"),

  validatorMiddleware,
];
