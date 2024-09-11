const express = require("express");
const router = express.Router();

const webhookController = require("../controllers/webhookController");

router.post("/payments", webhookController.paymentWebhook);

module.exports = router;
