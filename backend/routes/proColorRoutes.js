const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const colorController = require("../controllers/proColorController");
const colorValidator = require("../utils/validators/proColorValidator");

router.use(authController.protect, authController.restrictTo("admin"));

router.post(
  "/",
  colorController.uploadColorImage,
  colorController.resizeColorImage,
  colorValidator.createColorValidator,
  colorController.createColor
);

router.delete(
  "/:id",
  colorValidator.deleteColorValidator,
  colorController.deleteColor
);

module.exports = router;
