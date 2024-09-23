const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createCardValidator = [
  check("isSpecial")
    .notEmpty()
    .withMessage("isSpecial is required")
    .isBoolean()
    .withMessage("isSpecial must be a boolean"),

  check("shop")
    .notEmpty()
    .withMessage("Shop is required")
    .isMongoId()
    .withMessage("Shop must be a valid MongoDB ID"),

  check("color")
    .optional()
    .isMongoId()
    .withMessage("Color must be a valid MongoDB ID"),

  check("proColor")
    .if((value, { req }) => !req.body.isSpecial && !req.body.color)
    .notEmpty()
    .withMessage("ProColor is required (no color provided)")
    .isMongoId()
    .withMessage("ProColor must be a valid MongoDB ID"),

  check("shape")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Shape is required")
    .isMongoId()
    .withMessage("Shape must be a valid MongoDB ID"),

  check("shapePosition")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Shape position coordinates are required")
    .isObject()
    .withMessage("Shape position must be an object"),

  check("shapePosition.x")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Shape position X coordinate is required")
    .isNumeric()
    .withMessage("Shape position X coordinate must be a number"),

  check("shapePosition.y")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Shape position Y coordinate is required")
    .isNumeric()
    .withMessage("Shape position Y coordinate must be a number"),

  check("shapeScale")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Shape scale is required")
    .isNumeric()
    .withMessage("Shape scale must be a number"),

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
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Text font family is required")
    .isString()
    .withMessage("Text font family must be a string"),

  check("price.fontSize")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Text font size is required")
    .isNumeric()
    .withMessage("Text font size must be a number"),

  check("price.fontColor")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Text font color is required")
    .isHexColor()
    .withMessage("Text font color must be a valid hex color"),

  check("price.fontWeight")
    .if((value, { req }) => !req.body.isSpecial)
    .optional()
    .isNumeric()
    .withMessage("Text font weight must be a number"),

  check("text")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Text information is required")
    .isObject()
    .withMessage("Text must be an object"),

  check("text.message")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Text message is required")
    .isString()
    .withMessage("Text message must be a string"),

  check("text.fontFamily")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Text font family is required")
    .isString()
    .withMessage("Text font family must be a string"),

  check("text.fontSize")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Text font size is required")
    .isNumeric()
    .withMessage("Text font size must be a number"),

  check("text.fontColor")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Text font color is required")
    .isHexColor()
    .withMessage("Text font color must be a valid hex color"),

  check("text.fontWeight")
    .if((value, { req }) => !req.body.isSpecial)
    .optional()
    .isNumeric()
    .withMessage("Text font weight must be a number"),

  check("text.xPosition")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Text X position is required")
    .isNumeric()
    .withMessage("Text X position must be a number"),

  check("text.yPosition")
    .if((value, { req }) => !req.body.isSpecial)
    .notEmpty()
    .withMessage("Text Y position is required")
    .isNumeric()
    .withMessage("Text Y position must be a number"),

  // NOT ALLOWED

  check("user").isEmpty().withMessage("User cannot be set"),

  check("isPaid").isEmpty().withMessage("isPaid cannot be set"),

  check("discountCode").isEmpty().withMessage("Discount code cannot be set"),

  check("priceAfterDiscount")
    .isEmpty()
    .withMessage("Price after discount cannot be set"),

  check("isDelivered").isEmpty().withMessage("isDelivered cannot be set"),

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

exports.addRecipientInfoValidator = [
  check("id")
    .notEmpty()
    .withMessage("Card ID is required")
    .isMongoId()
    .withMessage("Card ID must be a valid MongoDB ID"),

  check("recipient")
    .notEmpty()
    .withMessage("Recipient information is required")
    .isObject()
    .withMessage("Recipient must be an object"),

  check("recipient.name")
    .notEmpty()
    .withMessage("Recipient name is required")
    .isString()
    .withMessage("Recipient name must be a string"),

  check("recipient.whatsappNumber")
    .notEmpty()
    .withMessage("Recipient whatsapp number is required")
    .isString()
    .withMessage("Recipient whatsapp number must be a string"),

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

  check("celebrateIcon")
    .optional()
    .isString()
    .withMessage("Celebrate icon must be a string"),

  check("celebrateLink")
    .optional()
    .isURL()
    .withMessage("Celebrate link must be a valid URL"),

  // NOT ALLOWED TO UPDATE

  check("isSpecial").isEmpty().withMessage("isSpecial cannot be updated"),

  check("isPaid").isEmpty().withMessage("isPaid cannot be updated"),

  check("user").isEmpty().withMessage("User cannot be updated"),

  check("discountCode")
    .isEmpty()
    .withMessage("Discount code cannot be updated"),

  check("priceAfterDiscount")
    .isEmpty()
    .withMessage("PriceAfterDiscount cannot be updated"),

  check("isDelivered").isEmpty().withMessage("isDelivered cannot be updated"),

  check("price").isEmpty().withMessage("Price cannot be updated"),

  check("shop").isEmpty().withMessage("Shop cannot be updated"),

  check("color").isEmpty().withMessage("Color cannot be updated"),

  check("shape").isEmpty().withMessage("Shape cannot be updated"),

  check("proColor").isEmpty().withMessage("ProColor cannot be updated"),

  check("text").isEmpty().withMessage("Text cannot be updated"),

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
