import { application } from "express";
import Joi from "joi";

export const startInterviewSchema = Joi.object({
    applicationId: Joi.number().required(),
});

export const sendMessageSchema = Joi.object({
    message: Joi.string().required(),
});