const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { generateToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

const register = asyncHandler(async (req, res) => {
  const { username, email, password, firstName, lastName, role } =
    req.validatedBody;

  if (!username || !email || !password || !firstName || !lastName) {
    throw new AppError("All fields are required", 400);
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new AppError("Username or email already exists", 409);
  }

  const user = await User.create({
    username,
    email,
    password,
    firstName,
    lastName,
    role,
  });

  user.password = undefined;

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user,
      token,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }
  user.password = undefined;

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user,
      token,
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  register,
  login,
  getMe,
};
