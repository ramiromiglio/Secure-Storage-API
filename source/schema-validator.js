import { APIError } from "./errors.js";

const schemas = { post: [], put: [], patch: [], query: [] };

function defineSchema(domain, path, joiObject) {
    domain = domain.toLowerCase();
    if (schemas[domain] == null || schemas[domain][path] != null)
        throw APIError.ERR_INTERNAL_SERVER();
    schemas[domain][path] = joiObject;
}

function validateSchema(domain, schema, object) {
    const joischema = schemas[domain.toLowerCase()]?.[schema];
    if (! joischema)
        throw APIError.ERR_INTERNAL_SERVER();

    const {error, value} = joischema.validate(object, {abortEarly: false});

    if (error) {
        const details = error.details.map(detail => {
            return {
                path: detail.context.key,
                type: detail.type
            };
        });
        throw APIError.ERR_INVALID_SCHEMA(details);
    }

    return value;
}

export {
    defineSchema,
    validateSchema,
}