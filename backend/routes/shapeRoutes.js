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

router
  .route("/:id")
  .delete(shapeValidator.deleteShapeValidator, shapeController.deleteShape)
  .patch(shapeValidator.updateShapeValidator, shapeController.updateShape);

module.exports = router;
