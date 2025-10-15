const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(postController.getAllPosts)
  .post(protect, postController.createPost);

router
  .route("/:postId")
  .get(postController.getPost)
  .put(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
