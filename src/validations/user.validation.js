const Joi = require("joi");

const createUserSchema = Joi.object({
  username: Joi.string().min(2).max(50).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 2 characters long",
    "string.max": "Username cannot exceed 50 characters",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).max(128).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password cannot exceed 128 characters",
    "any.required": "Password is required",
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.base": "FirstName must be a string",
    "string.empty": "FirstName cannot be empty",
    "string.min": "FirstName must be at least 2 characters long",
    "string.max": "FirstName cannot exceed 50 characters",
    "any.required": "FirstName is required",
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "string.base": "LastName must be a string",
    "string.empty": "LastName cannot be empty",
    "string.min": "LastName must be at least 2 characters long",
    "string.max": "LastName cannot exceed 50 characters",
    "any.required": "LastName is required",
  }),
  role: Joi.string().valid("reader", "author", "admin").optional().messages({
    "string.base": "Role must be a string",
    "string.empty": "Role cannot be empty",
    "any.only": "Role must be one of: reader, author, admin",
    "any.required": "Role is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(2).max(50).optional().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 2 characters long",
    "string.max": "Username cannot exceed 50 characters",
  }),
  email: Joi.string().email().optional().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email address",
  }),
  firstName: Joi.string().min(2).max(50).optional().messages({
    "string.base": "FirstName must be a string",
    "string.empty": "FirstName cannot be empty",
    "string.min": "FirstName must be at least 2 characters long",
    "string.max": "FirstName cannot exceed 50 characters",
  }),
  lastName: Joi.string().min(2).max(50).optional().messages({
    "string.base": "LastName must be a string",
    "string.empty": "LastName cannot be empty",
    "string.min": "LastName must be at least 2 characters long",
    "string.max": "LastName cannot exceed 50 characters",
  }),
  password: Joi.string().min(8).max(50).optional().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password cannot exceed 50 characters",
  }),
}).min(1);

module.exports = {
  createUserSchema,
  loginSchema,
  updateUserSchema,
};
