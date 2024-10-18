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

router.get("/", shopController.getAllShops);
router.get("/:id", shopValidator.getShopValidator, shopController.getShop);

router.use(authController.protect, authController.restrictTo("admin"));

router.post(
  "/",
  shopController.uploadShopLogo,
  shopController.resizeShopLogo,
  shopValidator.createShopValidator,
  shopController.createShop
);

router
  .route("/:id")
  .patch(
    shopController.uploadShopLogo,
    shopController.resizeShopLogo,
    shopValidator.updateShopValidator,
    shopController.updateShop
  )
  .delete(shopValidator.deleteShopValidator, shopController.deleteShop);

module.exports = router;
