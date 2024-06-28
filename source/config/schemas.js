import Joi from "joi";
import { defineSchema } from "../schema-validator.js";

defineSchema('post', '/auth/signup', Joi.object({
    username: Joi.string().min(10).max(20).required(),
    password: Joi.string().alphanum().min(10).max(20).required()
}));

defineSchema('post', '/auth/signin', Joi.object({
    username: Joi.string().min(10).max(20).required(),
    password: Joi.string().alphanum().min(10).max(20).required()
}));

defineSchema('post', '/storage', Joi.binary().max(128 * 1024 * 1024));
defineSchema('query', 'token', Joi.string().max(8092).required());

export default {};