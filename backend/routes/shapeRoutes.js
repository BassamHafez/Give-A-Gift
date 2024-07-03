const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const shapeController = require("../controllers/shapeController");
const shapeValidator = require("../utils/validators/shapeValidator");

router.get("/", shapeController.getAllShapes);

router.use(authController.protect, authController.restrictTo("admin"));

router.post(
  "/",
  shapeController.uploadShapeImage,
  shapeController.resizeShapeImage,
  shapeValidator.createShapeValidator,
  shapeController.createShape
);

router.delete(
  "/:id",
  shapeValidator.deleteShapeValidator,
  shapeController.deleteShape
);

module.exports = router;