const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().min(5).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 5 characters long",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),

  description: Joi.string().min(10).max(1000).optional().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 1000 characters",
  }),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(5).max(50).optional().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 5 characters long",
    "string.max": "Name cannot exceed 50 characters",
  }),
  description: Joi.string().min(10).max(1000).optional().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 1000 characters",
  }),
}).min(1);

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
