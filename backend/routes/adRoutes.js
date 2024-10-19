const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const adController = require("../controllers/adController");
const adValidator = require("../utils/validators/adValidator");

router.get("/", adController.getAllAds);

router.use(authController.protect, authController.restrictTo("admin"));

router.post(
  "/",
  adController.uploadAdImage,
  adController.resizeAdImage,
  adValidator.createAdValidator,
  adController.createAd
);

router
  .route("/:id")
  .patch(
    adController.uploadAdImage,
    adController.resizeAdImage,
    adValidator.updateAdValidator,
    adController.updateAd
  )
  .delete(adValidator.deleteAdValidator, adController.deleteAd);

module.exports = router;
