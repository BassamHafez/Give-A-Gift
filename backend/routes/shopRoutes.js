const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const shopController = require("../controllers/shopController");
const shopValidator = require("../utils/validators/shopValidator");

router.get(
  "/tokens",
  authController.protect,
  authController.restrictTo("admin"),
  shopController.getAllShopTokens
);
router.post(
  "/messages",
  authController.protect,
  authController.restrictTo("admin"),
  shopValidator.sendShopsMessagesValidator,
  shopController.sendShopsMessages
);
router.get("/home", shopController.getHomeShops);
router.get("/top", shopController.getTopShops);
router.post("/join-us", shopValidator.joinUsValidator, shopController.joinUs);

router.get("/", shopController.getAllShops);
router.get("/:id", shopValidator.getShopValidator, shopController.getShop);

router.use(authController.protect, authController.restrictTo("admin"));

router.post(
  "/",
  shopController.uploadShopLogos,
  shopController.resizeShopLogos,
  shopValidator.createShopValidator,
  shopController.createShop
);

router
  .route("/:id")
  .patch(
    shopController.uploadShopLogos,
    shopController.resizeShopLogos,
    shopValidator.updateShopValidator,
    shopController.updateShop
  )
  .delete(shopValidator.deleteShopValidator, shopController.deleteShop);

module.exports = router;
