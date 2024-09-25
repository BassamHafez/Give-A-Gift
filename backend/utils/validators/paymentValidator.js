const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.executePaymentValidator = [
  check("PaymentMethodId")
    .notEmpty()
    .withMessage("PaymentMethodId is required")
    .isNumeric()
    .withMessage("PaymentMethodId must be a number"),

  check("InvoiceValue")
    .notEmpty()
    .withMessage("InvoiceValue is required")
    .isNumeric()
    .withMessage("InvoiceValue must be a number"),

  check("cardId")
    .notEmpty()
    .withMessage("cardId is required")
    .isMongoId()
    .withMessage("cardId must be a valid MongoId"),

  check("successURL")
    .notEmpty()
    .withMessage("successURL is required")
    .isString()
    .withMessage("successURL must be a string"),

  check("errorURL")
    .notEmpty()
    .withMessage("errorURL is required")
    .isString()
    .withMessage("errorURL must be a string"),

  validatorMiddleware,
];
