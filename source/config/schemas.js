import Joi from "joi";
import { defineSchema } from "../schema-validator.js";

const userRegPattern = /^[a-z]+(-?[a-z0-9]+)*$/i;

defineSchema('post', '/auth/signup', Joi.object({
    username: Joi.string().pattern(userRegPattern).min(10).max(20).required(),
    password: Joi.string().alphanum().min(10).max(20).required()
}));

defineSchema('post', '/auth/signin', Joi.object({
    username: Joi.string().pattern(userRegPattern).min(10).max(20).required(),
    password: Joi.string().alphanum().min(10).max(20).required()
}));

defineSchema('post', '/storage', Joi.binary().max(128 * 1024 * 1024));
defineSchema('query', 'token', Joi.string().max(8092).required());

export default {};