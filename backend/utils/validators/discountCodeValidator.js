const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.sendDiscountCodeRemindersValidator = [
  check("codesIds")
    .notEmpty()
    .withMessage("codesIds is required")
    .isArray({ min: 1 })
    .withMessage("codesIds must be an array with at least one ID"),

  check("codesIds.*")
    .isMongoId()
    .withMessage("codesIds must contain valid MongoDB IDs"),

  validatorMiddleware,
];

exports.getDiscountCodeValueValidator = [
  check("cardId")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Invalid card ID"),

  validatorMiddleware,
];
