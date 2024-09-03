const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const transactionController = require("../controllers/transactionController");

router.use(authController.protect, authController.restrictTo("admin"));

router.get("/", transactionController.getAllTransactions);
router.get(
  "/total-invoice-success",
  transactionController.getTotalSuccessfulInvoiceValue
);

module.exports = router;
