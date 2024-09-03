const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const walletController = require("../controllers/walletController");
const walletValidator = require("../utils/validators/walletValidator");

router.use(authController.protect);

router.get("/me", walletController.getMyWallet);

router.post(
  "/transfer",
  walletValidator.transferValidator,
  walletController.transfer
);

router.post(
  "/buy-card",
  walletValidator.buyCardValidator,
  walletController.buyCard
);

router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(walletController.getAllWallets)
  .patch(
    walletValidator.addBalanceToWalletValidator,
    walletController.addBalanceToAllWallets
  );

router
  .route("/:id")
  .get(walletValidator.getWalletValidator, walletController.getUserWallet)
  .patch(
    walletValidator.addBalanceToWalletValidator,
    walletController.addBalanceToWallet
  );

module.exports = router;
