const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const categoryController = require("../controllers/categoryController");
const categoryValidator = require("../utils/validators/categoryValidator");

router.get("/", categoryController.getAllCategories);

router.use(authController.protect, authController.restrictTo("admin"));

router.post(
  "/",
  categoryController.uploadCategoryIcon,
  categoryController.resizeCategoryIcon,
  categoryValidator.createCategoryValidator,
  categoryController.createCategory
);

router
  .route("/:id")
  .patch(
    categoryController.uploadCategoryIcon,
    categoryController.resizeCategoryIcon,
    categoryValidator.updateCategoryValidator,
    categoryController.updateCategory
  )
  .delete(
    categoryValidator.deleteCategoryValidator,
    categoryController.deleteCategory
  );

module.exports = router;
