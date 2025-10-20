const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validations/category.validation");
const validate = require("../middleware/validate");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(categoryController.getAllCategorys)
  .post(
    protect,
    authorize("admin"),
    validate(createCategorySchema),
    categoryController.createCategory
  );

router
  .route("/:categoryId")
  .get(categoryController.getCategory)
  .put(
    protect,
    authorize("admin"),
    validate(updateCategorySchema),
    categoryController.updateCategory
  )
  .delete(protect, authorize("admin"), categoryController.deleteCategory);

module.exports = router;
