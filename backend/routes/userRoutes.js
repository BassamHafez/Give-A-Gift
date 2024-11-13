const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const userValidator = require("../utils/validators/userValidator");

router.use(authController.protect);

router
  .route("/me")
  .get(userController.getMe, userController.getUser)
  .delete(userController.getMe, userController.deleteMe);

router.patch(
  "/updateMe",
  userValidator.updateMeValidator,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.patch(
  "/updateMyPassword",
  userValidator.updatePasswordValidator,
  userController.updatePassword
);

router.get("/phone-wa-code", userController.getPhoneWACode);
router.post(
  "/verify-phone",
  userValidator.verifyPhoneValidator,
  userController.verifyPhone
);

router.use(authController.restrictTo("admin"));

router
  .route("/admin")
  .post(userValidator.addAdminValidator, userController.addAdmin);

router
  .route("/merchant")
  .post(userValidator.addMerchantValidator, userController.addMerchant);

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;
