const Joi = require("joi");

const createPostSchema = Joi.object({
  title: Joi.string().min(5).max(50).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 5 characters long",
    "string.max": "Title cannot exceed 50 characters",
    "any.required": "Title is required",
  }),

  content: Joi.string().min(10).max(1000).required().messages({
    "string.base": "Content must be a string",
    "string.empty": "Content cannot be empty",
    "string.min": "Content must be at least 10 characters long",
    "string.max": "Content cannot exceed 1000 characters",
    "any.required": "Content is required",
  }),
  image: Joi.string().optional(),

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.base": "Category must be a string",
      "string.empty": "Category cannot be empty",
      "string.pattern.base": "Category must be a valid MongoDB ID",
      "any.required": "Category is required",
    }),
});

const updatePostSchema = Joi.object({
  title: Joi.string().min(5).max(50).optional().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 5 characters long",
    "string.max": "Title cannot exceed 50 characters",
  }),
  content: Joi.string().min(10).max(1000).optional().messages({
    "string.base": "Content must be a string",
    "string.empty": "Content cannot be empty",
    "string.min": "Content must be at least 10 characters long",
    "string.max": "Content cannot exceed 1000 characters",
  }),
  image: Joi.string().optional(),

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.base": "Category must be a string",
      "string.empty": "Category cannot be empty",
      "string.pattern.base": "Category must be a valid MongoDB ID",
    }),
}).min(1);

module.exports = {
  createPostSchema,
  updatePostSchema,
};
