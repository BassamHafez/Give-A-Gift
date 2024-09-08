const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const colorController = require("../controllers/colorController");
const colorValidator = require("../utils/validators/colorValidator");

router.get("/", colorController.getAllColors);

router.use(authController.protect, authController.restrictTo("admin"));

router.post(
  "/",
  colorValidator.createColorValidator,
  colorController.createColor
);

router.delete(
  "/:id",
  colorValidator.deleteColorValidator,
  colorController.deleteColor
);

module.exports = router;
