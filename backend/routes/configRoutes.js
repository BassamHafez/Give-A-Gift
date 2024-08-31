const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const configController = require("../controllers/configController");

router.use(authController.protect, authController.restrictTo("admin"));

router.get("/", configController.getConfigs);
router.patch("/", configController.updateConfigs);

module.exports = router;
