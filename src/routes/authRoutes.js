const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  createUserSchema,
  loginSchema,
} = require("../validations/user.validation");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

router.post("/register", validate(createUserSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", protect, authController.getMe);

module.exports = router;
