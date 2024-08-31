const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const paymentController = require("../controllers/paymentController");
const paymentValidator = require("../utils/validators/paymentValidator");

router.use(authController.protect);

router.get("/payment-methods", paymentController.getPaymentMethods);
router.post(
  "/execute-payment",
  paymentValidator.executePaymentValidator,
  paymentController.executePayment
);
// router.post("/initiate-payment", paymentController.initiatePayment);
router.post("/verify-payment", paymentController.verifyPayment);
// router.post("/pay-invoice", paymentController.payInvoice);
// router.post("/send-payment", paymentController.sendPayment);
// router.get("/initiate-session", paymentController.initiateSession);

module.exports = router;
