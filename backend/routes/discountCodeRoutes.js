const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const discountCodeController = require("../controllers/discountCodeController");

router.use(authController.protect);

router.get(
  "/merchant",
  authController.restrictTo("merchant"),
  discountCodeController.getAllMerchantDiscountCodes
);

router
  .route("/:cardId")
  .get(
    authController.restrictTo("merchant"),
    discountCodeController.getDiscountCodeValue
  );

module.exports = router;
