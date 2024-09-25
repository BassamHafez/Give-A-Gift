const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const cardController = require("../controllers/cardController");
const cardValidator = require("../utils/validators/cardValidator");

router.get("/:id", cardController.getCard);

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
  // .get(
  //   cardValidator.getCardValidator,
  //   cardController.filterUserCards,
  //   cardController.getCard
  // )
  .patch(
    cardValidator.addRecipientInfoValidator,
    cardController.filterUserCards,
    cardController.addRecipientInfo
  )
  .delete(
    cardValidator.deleteCardValidator,
    authController.restrictTo("user"),
    cardController.filterUserCards,
    cardController.deleteCard
  );

router.put("/:id/apply-coupon", cardController.applyCoupon);

router.use(authController.restrictTo("admin"));

router
  .route("/reminders")
  .post(
    cardValidator.sendCartRemindersValidator,
    cardController.sendCartReminders
  );

module.exports = router;
