import Joi from "joi";

export const userUpdateSchema = Joi.object({
  firstName: Joi.string().required(),
}).required();

export const userFilterSchema = Joi.object({
  age: Joi.number().min(10).max(80),
  char: Joi.string().length(1).required(),
}).required();

export const userNamesSchema = Joi.object({
  name1: Joi.string().min(3).max(10),
  name2: Joi.string().min(3).max(10),
}).required();
