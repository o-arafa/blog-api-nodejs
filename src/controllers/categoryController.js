const Category = require("../models/category");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

const getAllCategorys = asyncHandler(async (req, res) => {
  const categorys = await Category.find();
  res.status(200).json({
    success: true,
    data: categorys,
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  category.views += 1;
  await category.save();

  res.status(200).json({
    success: true,
    data: category,
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  console.log(req.body);
  if (!name || !description) {
    throw new AppError("name and description are required", 400);
  }

  const newCategory = await Category.create({
    name,
    description,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: newCategory,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError("Please provide at least one field to update", 400);
  }

  const category = await Category.findByIdAndUpdate(
    req.params.categoryId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: {},
  });
});

module.exports = {
  getAllCategorys,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
