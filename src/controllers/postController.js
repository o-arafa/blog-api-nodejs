const Post = require("../models/Post");
const Category = require("../models/Category");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

const getAllPosts = asyncHandler(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 5;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  let sortBy = "-createdAt";
  if (query.sort) {
    sortBy = query.sort;
  }
  const filter = {};

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { content: { $regex: query.search, $options: "i" } },
    ];
  }

  const posts = await Post.find(filter).sort(sortBy).limit(limit).skip(skip);
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
  const { title, content, category } = req.validatedBody;

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
    author: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: newPost,
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.postId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
    throw new AppError("You are not authorized to perform this action", 403);
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError("Please provide at least one field to update", 400);
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

  if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
    throw new AppError("You are not authorized to perform this action", 403);
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
