const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const {
  createPostSchema,
  updatePostSchema,
} = require("../validations/post.validation");
const validate = require("../middleware/validate");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(postController.getAllPosts)
  .post(
    protect,
    authorize("author", "admin"),
    validate(createPostSchema),
    postController.createPost
  );

router
  .route("/:postId")
  .get(postController.getPost)
  .put(
    protect,
    authorize("author", "admin"),
    validate(updatePostSchema),
    postController.updatePost
  )
  .delete(protect, authorize("author", "admin"), postController.deletePost);

module.exports = router;
