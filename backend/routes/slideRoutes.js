const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const slideController = require("../controllers/slideController");
const slideValidator = require("../utils/validators/slideValidator");

router.get("/", slideController.getAllSlides);

router.use(authController.protect, authController.restrictTo("admin"));

router.post(
  "/",
  slideController.uploadSlideImage,
  slideController.resizeSlideImage,
  slideValidator.createSlideValidator,
  slideController.createSlide
);

router
  .route("/:id")
  .patch(
    slideController.uploadSlideImage,
    slideController.resizeSlideImage,
    slideValidator.updateSlideValidator,
    slideController.updateSlide
  )
  .delete(slideValidator.deleteSlideValidator, slideController.deleteSlide);

module.exports = router;
