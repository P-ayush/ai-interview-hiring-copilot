import Joi from "joi";

export const loginSchema = Joi.object({

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .required(),

});

export const signUpSchema = Joi.object({

    name: Joi.string()
        .min(3)
        .max(50)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .max(20)
        .required(),

    role: Joi.string()
        .valid("candidate", "recruiter")
        .optional(),

});