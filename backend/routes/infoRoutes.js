const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const infoController = require("../controllers/infoController");

router.use(authController.protect, authController.restrictTo("admin"));

router.get("/statistics", infoController.getStatistics);

module.exports = router;
