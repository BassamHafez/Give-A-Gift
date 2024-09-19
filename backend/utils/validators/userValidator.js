const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.updateMeValidator = [
  check("name").optional().isString().withMessage("Name must be a string"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email"),

  check("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Phone must be a valid phone number"),

  // NOT ALLOWED

  check("role").isEmpty().withMessage("Role cannot be set"),

  check("phoneVerified")
    .isEmpty()
    .withMessage("Phone verification cannot be set"),

  check("passwordResetCode")
    .isEmpty()
    .withMessage("Password reset code cannot be set here"),

  check("merchantShop")
    .isEmpty()
    .withMessage("Merchant shop id cannot be set here"),

  validatorMiddleware,
];

exports.updatePasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .isString()
    .withMessage("Current password must be a string"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isString()
    .withMessage("New password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 8 characters long"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required")
    .isString()
    .withMessage("Password confirm must be a string")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.verifyPhoneValidator = [
  check("verificationCode")
    .notEmpty()
    .withMessage("Verification code is required")
    .isString()
    .withMessage("Verification code must be a string"),

  validatorMiddleware,
];

exports.addAdminValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3 })
    .withMessage("Too short User name"),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required")
    .custom((passwordConfirm, { req }) => {
      if (passwordConfirm !== req.body.password) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.addMerchantValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3 })
    .withMessage("Too short User name"),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required")
    .custom((passwordConfirm, { req }) => {
      if (passwordConfirm !== req.body.password) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("merchantShop")
    .notEmpty()
    .withMessage("Merchant shop id required")
    .isMongoId()
    .withMessage("Invalid merchant shop id"),

  // NOT ALLOWED

  check("role").isEmpty().withMessage("Role cannot be set"),

  check("phoneVerified")
    .isEmpty()
    .withMessage("Phone verification cannot be set"),

  check("passwordResetCode")
    .isEmpty()
    .withMessage("Password reset code cannot be set here"),

  validatorMiddleware,
];
