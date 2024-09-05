const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createCardValidator = [
  check("price")
    .notEmpty()
    .withMessage("Price of the card is required")
    .isNumeric()
    .withMessage("Price of the card must be a number"),

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

  check("text")
    .notEmpty()
    .withMessage("Text is required")
    .isObject()
    .withMessage("Text must be an object")
    .custom((text) => {
      if (!text.message || typeof text.message !== "string") {
        throw new Error("Message (string) is required");
      }

      if (!text.fontFamily || typeof text.fontFamily !== "string") {
        throw new Error("Font family (string) is required");
      }

      if (!text.fontSize || typeof text.fontSize !== "number") {
        throw new Error("Font size (number) is required");
      }

      if (!text.fontColor || typeof text.fontColor !== "string") {
        throw new Error("Font color (string) is required");
      }

      if (text.fontWeight && typeof text.fontWeight !== "number") {
        throw new Error("Font weight must be a number");
      }

      if (!text.xPosition || typeof text.xPosition !== "number") {
        throw new Error("X position (number) is required");
      }

      if (!text.yPosition || typeof text.yPosition !== "number") {
        throw new Error("Y position (number) is required");
      }

      return true;
    }),

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

  check("text")
    .optional()
    .isObject()
    .withMessage("Text must be an object")
    .custom((text) => {
      if (text.message && typeof text.message !== "string") {
        throw new Error("Message (string) is required");
      }

      if (text.fontFamily && typeof text.fontFamily !== "string") {
        throw new Error("Font family (string) is required");
      }

      if (text.fontSize && typeof text.fontSize !== "number") {
        throw new Error("Font size (number) is required");
      }

      if (text.fontColor && typeof text.fontColor !== "string") {
        throw new Error("Font color (string) is required");
      }

      if (text.fontWeight && typeof text.fontWeight !== "number") {
        throw new Error("Font weight must be a number");
      }

      if (text.xPosition && typeof text.xPosition !== "number") {
        throw new Error("X position (number) is required");
      }

      if (text.yPosition && typeof text.yPosition !== "number") {
        throw new Error("Y position (number) is required");
      }

      return true;
    }),

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
