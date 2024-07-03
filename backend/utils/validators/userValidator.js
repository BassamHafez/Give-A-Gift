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
