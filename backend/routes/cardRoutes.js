const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const cardController = require("../controllers/cardController");
const cardValidator = require("../utils/validators/cardValidator");

router.use(authController.protect);

router.get("/", cardController.filterUserCards, cardController.getAllCards);

router.post(
  "/",
  cardValidator.createCardValidator,
  cardController.setUserId,
  cardController.createCard
);

router
  .route("/:id")
  .get(
    cardValidator.getCardValidator,
    cardController.filterUserCards,
    cardController.getCard
  )
  .patch(
    cardValidator.updateCardValidator,
    cardController.setUserId,
    cardController.filterUserCards,
    cardController.updateCard
  )
  .delete(
    cardValidator.deleteCardValidator,
    authController.restrictTo("user"),
    cardController.filterUserCards,
    cardController.deleteCard
  );

router.put("/:id/apply-coupon", cardController.applyCoupon);

module.exports = router;
