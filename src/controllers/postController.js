const Post = require("../models/post");
const Category = require("../models/category");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  res.status(200).json({
    success: true,
    data: posts,
  });
});

const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId).populate("category");

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  post.views += 1;
  await post.save();

  res.status(200).json({
    success: true,
    data: post,
  });
});

const createPost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    throw new AppError("Title and content are required", 400);
  }

  if (category) {
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      throw new AppError("Category not found", 404);
    }
  }

  const newPost = await Post.create({
    title,
    content,
    category,
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: newPost,
  });
});

const updatePost = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError("Please provide at least one field to update", 400);
  }

  const post = await Post.findByIdAndUpdate(req.params.postId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: post,
  });
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
    data: {},
  });
});

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
