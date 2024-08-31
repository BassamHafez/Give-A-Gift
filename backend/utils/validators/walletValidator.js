const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.transferValidator = [
  check("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),

  check("receiverEmail")
    .notEmpty()
    .withMessage("Receiver Email is required")
    .isEmail()
    .withMessage("Invalid receiver Email"),

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
