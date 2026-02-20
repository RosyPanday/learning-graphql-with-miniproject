import Joi from "joi";


export const createHackerValidation = Joi.object({
    hackerName: Joi.string().required(),
    hackerPassword:Joi.string().required(),
})