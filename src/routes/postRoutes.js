const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router
  .route("/")
  .get(postController.getAllPosts)
  .post(postController.createPost);

router
  .route("/:postId")
  .get(postController.getPost)
  .put(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
