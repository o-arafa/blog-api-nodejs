const Post = require("../models/Post");
const Category = require("../models/Category");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

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
    image: req.body.image || null,
  });
  if (newPost.image) {
    newPost.imageUrl = `${req.protocol}://${req.get("host")}/uploads/posts/${
      newPost.image
    }`;
  }

  console.log(req.file);

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

  if (post.image) {
    const imagePath = path.join(
      __dirname,
      "..",
      "uploads",
      "posts",
      post.image
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
    data: {},
  });
});
const likePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  const likeIndex = post.likes.indexOf(userId);

  if (likeIndex === -1) {
    post.likes.push(userId);
    post.likesCount += 1;

    await post.save();

    res.status(200).json({
      success: true,
      message: "post liked",
      data: {
        likesCount: post.likesCount,
        isLiked: true,
      },
    });
  } else {
    post.likes.splice(likeIndex, 1);
    post.likesCount -= 1;

    await post.save();

    res.status(200).json({
      success: true,
      message: "post unliked",
      data: {
        likesCount: post.likesCount,
        isLiked: false,
      },
    });
  }
});

const getPostLikes = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).populate("likes", "username");

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  res.status(200).json({
    success: true,
    count: post.likes.length,
    data: post.likes,
  });
});

const resizePostImage = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `post-${Date.now()}.jpeg`;
  req.body.image = filename;
  const filePath = path.join(__dirname, "..", "uploads", "posts", filename);

  console.log("Saving to:", filePath);
  await sharp(req.file.buffer)
    .resize(800, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(__dirname, "..", "uploads", "posts", filename));

  next();
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostLikes,
  resizePostImage,
};
