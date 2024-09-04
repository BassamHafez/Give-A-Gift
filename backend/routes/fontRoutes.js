const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const fontController = require("../controllers/fontController");
const fontValidator = require("../utils/validators/fontValidator");

router.get("/", fontController.getAllFonts);

router.use(authController.protect, authController.restrictTo("admin"));

router.post("/", fontValidator.createFontValidator, fontController.createFont);
router.delete(
  "/:id",
  fontValidator.deleteFontValidator,
  fontController.deleteFont
);

module.exports = router;
