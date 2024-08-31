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

  check("type")
    .notEmpty()
    .withMessage("type is required")
    .isString()
    .withMessage("type must be a string")
    .isIn(["DEPOSIT", "PAYMENT"])
    .withMessage("type must be either 'DEPOSIT' or 'PAYMENT"),

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
