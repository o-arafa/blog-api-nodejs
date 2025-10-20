const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const {
  createPostSchema,
  updatePostSchema,
} = require("../validations/post.validation");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(postController.getAllPosts)
  .post(protect, validate(createPostSchema), postController.createPost);

router
  .route("/:postId")
  .get(postController.getPost)
  .put(protect, validate(updatePostSchema), postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
