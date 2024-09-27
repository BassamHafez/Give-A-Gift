const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const discountCodeController = require("../controllers/discountCodeController");
const discountCodeValidator = require("../utils/validators/discountCodeValidator");

router.use(authController.protect);

router.get(
  "/",
  authController.restrictTo("admin"),
  discountCodeController.getAllDiscountCodes
);

router.get(
  "/merchant",
  authController.restrictTo("merchant"),
  discountCodeController.getAllMerchantDiscountCodes
);

router
  .route("/:cardId")
  .get(
    authController.restrictTo("merchant"),
    discountCodeValidator.getDiscountCodeValueValidator,
    discountCodeController.getDiscountCodeValue
  );

module.exports = router;
