const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name must be a string"),

  check("enName")
    .notEmpty()
    .withMessage("enName (Category name in English) is required")
    .isString()
    .withMessage("enName (Category name in English) must be a string"),

  check("icon").notEmpty().withMessage("Category icon is required"),

  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ID"),

  check("name")
    .optional()
    .isString()
    .withMessage("Category name must be a string"),

  check("enName")
    .optional()
    .isString()
    .withMessage("enName (Category name in English) must be a string"),

  check("icon").optional(),

  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Category ID must be a valid MongoDB ID"),

  validatorMiddleware,
];
