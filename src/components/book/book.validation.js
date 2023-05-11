import Joi from "joi";

export const addBookSchema = Joi.object({
  name: Joi.string().required().min(10).max(100).messages({
    "any.required": "name is required!",
    "string.base": "name should be a type of string!",
    "string.empty": "name can not be empty!",
    "string.min": "name should be at least 10 characters!",
    "string.max": "name should be maximum 100 characters!",
  }),
  description: Joi.string().required().min(20).messages({
    "any.required": "description is required!",
    "string.base": "description should be a type of string!",
    "string.min": "description should be at least 20 characters!",
  }),
})
  .required()
  .unknown(true);

export const updateBookSchema = Joi.object({
  name: Joi.string().min(10).max(100).messages({
    "string.base": "name should be a type of string!",
    "string.empty": "name can not be empty!",
    "string.min": "name should be at least 10 characters!",
    "string.max": "name should be maximum 100 characters!",
  }),
  description: Joi.string().min(20).messages({
    "string.base": "description should be a type of string!",
    "string.min": "description should be at least 20 characters!",
  }),
})
  .required()
  .unknown(true);
