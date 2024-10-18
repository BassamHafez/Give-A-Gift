const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.getShopValidator = [
  check("id")
    .notEmpty()
    .withMessage("Shop ID is required")
    .isMongoId()
    .withMessage("Shop ID must be a valid MongoDB ID"),

  validatorMiddleware,
];

exports.createShopValidator = [
  check("name")
    .notEmpty()
    .withMessage("Shop name is required")
    .isString()
    .withMessage("Shop name must be a string"),

  check("email")
    .notEmpty()
    .withMessage("Shop email is required")
    .isEmail()
    .withMessage("Shop email must be a valid email address"),

  check("phone")
    .notEmpty()
    .withMessage("Shop phone is required")
    .isMobilePhone()
    .withMessage("Shop phone must be a valid phone number"),

  check("logo").notEmpty().withMessage("Shop logo is required"),

  check("description")
    .notEmpty()
    .withMessage("Shop description is required")
    .isString()
    .withMessage("Shop description must be a string"),

  check("isOnline")
    .notEmpty()
    .withMessage("Shop isOnline is required")
    .isBoolean()
    .withMessage("Shop isOnline must be a boolean"),

  check("priority")
    .optional()
    .isNumeric()
    .withMessage("Priority must be a number"),

  check("category")
    .notEmpty()
    .withMessage("Shop category is required")
    .isMongoId()
    .withMessage("Shop category must be a valid MongoDB ID"),

  check("showInHome")
    .optional()
    .isBoolean()
    .withMessage("Shop showInHome must be a boolean"),

  check("link")
    .if((value, { req }) => req.body.isOnline === "true")
    .notEmpty()
    .withMessage("Shop link is required for online shops")
    .isURL({
      allow_underscores: true,
      allow_trailing_dot: true,
      allow_numeric_tld: true,
      allow_wildcard: true,
      allow_protocol_relative_urls: true,
    })
    .withMessage("Shop link must be a valid URL"),

  // NOT ALLOWED
  check("token").isEmpty().withMessage("Token cannot be set"),

  validatorMiddleware,
];

exports.updateShopValidator = [
  check("id")
    .notEmpty()
    .withMessage("Shop ID is required")
    .isMongoId()
    .withMessage("Shop ID must be a valid MongoDB ID"),

  check("name").optional().isString().withMessage("Shop name must be a string"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Shop email must be a valid email address"),

  check("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Shop phone must be a valid phone number"),

  check("description")
    .optional()
    .isString()
    .withMessage("Shop description must be a string"),

  check("isOnline")
    .optional()
    .isBoolean()
    .withMessage("Shop isOnline must be a boolean"),

  check("priority")
    .optional()
    .isNumeric()
    .withMessage("Priority must be a number"),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Shop category must be a valid MongoDB ID"),

  check("showInHome")
    .optional()
    .isBoolean()
    .withMessage("Shop showInHome must be a boolean"),

  check("link")
    .if((value, { req }) => req.body.isOnline === "true")
    .optional()
    .isURL({
      allow_underscores: true,
      allow_trailing_dot: true,
      allow_numeric_tld: true,
      allow_wildcard: true,
      allow_protocol_relative_urls: true,
    })
    .withMessage("Shop link must be a valid URL"),

  // NOT ALLOWED
  check("token").isEmpty().withMessage("Token cannot be set"),

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
