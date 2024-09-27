const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.getDiscountCodeValueValidator = [
  check("cardId")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Invalid card ID"),

  validatorMiddleware,
];
