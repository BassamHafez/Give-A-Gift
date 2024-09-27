const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

router.use(authController.protect);

router.route("/").get(orderController.setUserId, orderController.getAllOrders);

router.route("/:id").delete(orderController.cancelOrder);

module.exports = router;
