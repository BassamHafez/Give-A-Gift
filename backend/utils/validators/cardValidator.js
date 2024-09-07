const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createCardValidator = [
  check("shop")
    .notEmpty()
    .withMessage("Shop is required")
    .isMongoId()
    .withMessage("Shop must be a valid MongoDB ID"),

  check("color")
    .notEmpty()
    .withMessage("Color is required")
    .isHexColor()
    .withMessage("Color must be a valid hex color"),

  check("shape")
    .notEmpty()
    .withMessage("Shape is required")
    .isMongoId()
    .withMessage("Shape must be a valid MongoDB ID"),

  check("price")
    .notEmpty()
    .withMessage("Price information is required")
    .isObject()
    .withMessage("Price must be an object"),

  check("price.value")
    .notEmpty()
    .withMessage("Price value is required")
    .isNumeric()
    .withMessage("Price value must be a number"),

  check("price.fontFamily")
    .notEmpty()
    .withMessage("Text font family is required")
    .isString()
    .withMessage("Text font family must be a string"),

  check("price.fontSize")
    .notEmpty()
    .withMessage("Text font size is required")
    .isNumeric()
    .withMessage("Text font size must be a number"),

  check("price.fontColor")
    .notEmpty()
    .withMessage("Text font color is required")
    .isHexColor()
    .withMessage("Text font color must be a valid hex color"),

  check("price.fontWeight")
    .optional()
    .isNumeric()
    .withMessage("Text font weight must be a number"),

  check("text")
    .notEmpty()
    .withMessage("Text information is required")
    .isObject()
    .withMessage("Text must be an object"),

  check("text.message")
    .notEmpty()
    .withMessage("Text message is required")
    .isString()
    .withMessage("Text message must be a string"),

  check("text.fontFamily")
    .notEmpty()
    .withMessage("Text font family is required")
    .isString()
    .withMessage("Text font family must be a string"),

  check("text.fontSize")
    .notEmpty()
    .withMessage("Text font size is required")
    .isNumeric()
    .withMessage("Text font size must be a number"),

  check("text.fontColor")
    .notEmpty()
    .withMessage("Text font color is required")
    .isHexColor()
    .withMessage("Text font color must be a valid hex color"),

  check("text.fontWeight")
    .optional()
    .isNumeric()
    .withMessage("Text font weight must be a number"),

  check("text.xPosition")
    .notEmpty()
    .withMessage("Text X position is required")
    .isNumeric()
    .withMessage("Text X position must be a number"),

  check("text.yPosition")
    .notEmpty()
    .withMessage("Text Y position is required")
    .isNumeric()
    .withMessage("Text Y position must be a number"),

  validatorMiddleware,
];

exports.getCardValidator = [
  check("id")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Card ID must be a valid MongoDB ID"),

  validatorMiddleware,
];

exports.updateCardValidator = [
  check("id")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Card ID must be a valid MongoDB ID"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Price of the card must be a number"),

  check("shop")
    .optional()
    .isMongoId()
    .withMessage("Shop must be a valid MongoDB ID"),

  check("color")
    .optional()
    .isHexColor()
    .withMessage("Color must be a valid hex color"),

  check("shape")
    .optional()
    .isMongoId()
    .withMessage("Shape must be a valid MongoDB ID"),

  check("text").optional().isObject().withMessage("Text must be an object"),

  check("text.message")
    .optional()
    .isString()
    .withMessage("Text message must be a string"),

  check("text.fontFamily")
    .optional()
    .isString()
    .withMessage("Text font family must be a string"),

  check("text.fontSize")
    .optional()
    .isNumeric()
    .withMessage("Text font size must be a number"),

  check("text.fontColor")
    .optional()
    .isHexColor()
    .withMessage("Text font color must be a valid hex color"),

  check("text.fontWeight")
    .optional()
    .isNumeric()
    .withMessage("Text font weight must be a number"),

  check("text.xPosition")
    .optional()
    .isNumeric()
    .withMessage("Text X position must be a number"),

  check("text.yPosition")
    .optional()
    .isNumeric()
    .withMessage("Text Y position must be a number"),

  check("recipient")
    .optional()
    .isObject()
    .withMessage("Recipient must be an object")
    .custom((recipient) => {
      if (recipient.name && typeof recipient.name !== "string") {
        throw new Error("Recipient name must be a string");
      }

      if (
        recipient.whatsappNumber &&
        typeof recipient.whatsappNumber !== "string"
      ) {
        throw new Error("Recipient whatsapp number must be a string");
      }

      return true;
    }),

  check("receiveAt")
    .optional()
    .isISO8601()
    .withMessage(
      "Receive at must be a valid date in the format YYYY-MM-DDTHH:MM:SSZ"
    )
    .custom((receiveAt) => {
      if (receiveAt < Date.now()) {
        throw new Error("Receive at must be a future date");
      }

      return true;
    }),

  validatorMiddleware,
];

exports.deleteCardValidator = [
  check("id")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Card ID must be a valid MongoDB ID"),

  validatorMiddleware,
];
