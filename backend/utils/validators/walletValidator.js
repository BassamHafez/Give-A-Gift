const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.transferValidator = [
  check("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),

  check("receiverPhone")
    .notEmpty()
    .withMessage("Receiver Phone is required")
    .isMobilePhone()
    .withMessage("Invalid receiver Phone"),

  validatorMiddleware,
];

exports.buyCardValidator = [
  check("cardId")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Invalid card ID"),

  validatorMiddleware,
];

exports.getWalletValidator = [
  check("id")
    .notEmpty()
    .withMessage("ID is required")
    .isMongoId()
    .withMessage("Invalid ID"),

  validatorMiddleware,
];

exports.addBalanceToWalletValidator = [
  check("amountToIncrease")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),

  validatorMiddleware,
];
