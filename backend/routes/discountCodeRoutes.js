const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const discountCodeController = require("../controllers/discountCodeController");

router.use(authController.protect, authController.restrictTo("merchant"));

router.route("/").get(discountCodeController.getAllDiscountCodes);

router.route("/:cardId").get(discountCodeController.getDiscountCodeValue);

module.exports = router;
