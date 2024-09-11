const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createCouponValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Coupon name required")
    .isLength({ max: 32 })
    .withMessage("Coupon name must be less than 32 characters"),

  check("expire")
    .notEmpty()
    .withMessage("Coupon expire date required")
    .isISO8601()
    .withMessage(
      "expire date must be a valid date in the format YYYY-MM-DDTHH:MM:SSZ"
    )
    .custom((expire) => {
      if (expire < Date.now()) {
        throw new Error("Expire date must be a future date");
      }

      return true;
    }),

  check("discount")
    .notEmpty()
    .withMessage("Coupon discount percentage value required")
    .isInt({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),

  validatorMiddleware,
];

exports.getCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Coupon ID is required")
    .isMongoId()
    .withMessage("Coupon ID must be a valid MongoDB ID"),

  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Coupon ID is required")
    .isMongoId()
    .withMessage("Coupon ID must be a valid MongoDB ID"),

  check("name")
    .optional()
    .trim()
    .isLength({ max: 32 })
    .withMessage("Coupon name must be less than 32 characters"),

  check("expire")
    .optional()
    .isISO8601()
    .withMessage(
      "expire date must be a valid date in the format YYYY-MM-DDTHH:MM:SSZ"
    )
    .custom((expire) => {
      if (expire < Date.now()) {
        throw new Error("Expire date must be a future date");
      }

      return true;
    }),

  check("discount")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),

  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Coupon ID is required")
    .isMongoId()
    .withMessage("Coupon ID must be a valid MongoDB ID"),

  validatorMiddleware,
];
