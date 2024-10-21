const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const specialCardController = require("../controllers/specialCardController");
const specialCardValidator = require("../utils/validators/specialCardValidator");

router.get("/", specialCardController.getAllCards);
router.get("/latest", specialCardController.getLatestCards);

router.use(authController.protect, authController.restrictTo("admin"));

router.post(
  "/",
  specialCardValidator.createSpecialCardValidator,
  specialCardController.createCard
);

router
  .route("/:id")
  .patch(
    specialCardValidator.updateSpecialCardValidator,
    specialCardController.updateCard
  )
  .delete(
    specialCardValidator.deleteSpecialCardValidator,
    specialCardController.deleteCard
  );

router
  .route("/shapes")
  .put(
    specialCardController.uploadSpecialCardImages,
    specialCardController.updateSpecialShapes
  );

module.exports = router;
