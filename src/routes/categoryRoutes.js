const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authorize } = require("../middleware/auth");
router
  .route("/")
  .get(categoryController.getAllCategorys)
  .post(authorize("admin"), categoryController.createCategory);

router
  .route("/:categoryId")
  .get(categoryController.getCategory)
  .put(authorize("admin"), categoryController.updateCategory)
  .delete(authorize("admin"), categoryController.deleteCategory);

module.exports = router;
