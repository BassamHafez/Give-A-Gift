const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const couponController = require("../controllers/couponController");
const couponValidator = require("../utils/validators/couponValidator");

router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .get(couponController.getAllCoupons)
  .post(couponValidator.createCouponValidator, couponController.createCoupon);

router
  .route("/:id")
  .get(couponValidator.getCouponValidator, couponController.getCoupon)
  .patch(couponValidator.updateCouponValidator, couponController.updateCoupon)
  .delete(couponValidator.deleteCouponValidator, couponController.deleteCoupon);

module.exports = router;
