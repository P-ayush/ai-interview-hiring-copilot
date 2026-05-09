import Joi from "joi";

export const updateApplicationStatusSchema =
    Joi.object({

        status: Joi.string()
            .valid(
                "applied",
                "shortlisted",
                "rejected",
                "interview",
                "selected"
            )
            .required(),

    });