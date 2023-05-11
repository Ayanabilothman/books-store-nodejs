import Joi from "joi";

export const authRegisterSchema = Joi.object({
  userName: Joi.string().required().min(3).max(10).messages({
    "any.required": "Username is required!",
    "string.base": "Username should be a type of string!",
    "string.empty": "Username can not be empty!",
    "string.min": "Username should be at least 3 characters!",
    "string.max": "Username should be maximum 10 characters!",
  }),
  age: Joi.number().required().min(18).max(80).messages({
    "any.required": "Age is required!",
    "number.base": "Age should be a number!",
    "number.min": "You must be at least 18 years old",
    "number.max": "You must be at smaller than 80 years old",
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({ "string.email": "email must be valid!" }),
  password: Joi.string()
    .required()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .messages({
      "string.pattern.base":
        "Password must be at least eight characters, at least one letter and one number:",
    }),
  confirmPassword: Joi.string()
    .required()
    .messages({
      "any.only": "confirmPassword should be the same as the password!",
    })
    .valid(Joi.ref("password")),
  gender: Joi.required()
    .valid("Male", "Female")
    .messages({ "any.only": "Gender must be Male or Female!" }),
})
  .required()
  .unknown(true);

export const authLoginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({ "string.email": "email must be valid!" }),
  password: Joi.string()
    .required()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .messages({
      "string.pattern.base":
        "Password must be at least eight characters, at least one letter and one number:",
    }),
})
  .required()
  .unknown(true);
