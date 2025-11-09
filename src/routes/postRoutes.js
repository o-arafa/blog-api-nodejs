const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const {
  createPostSchema,
  updatePostSchema,
} = require("../validations/post.validation");
const validate = require("../middleware/validate");
const { protect, authorize } = require("../middleware/auth");

router.post("/:postId", protect, postController.likePost);
router.get("/:postId/likes", protect, postController.getPostLikes);

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
