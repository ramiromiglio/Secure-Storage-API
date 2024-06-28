import { validateSchema } from '../schema-validator.js';

export default function schemaValidator(schemaPath) {
    return (req, res, next) => {
        try {
            req.body = validateSchema(req.method, schemaPath, req.body);
            next();
        }
        catch (error) {
            next(error);
        }
    }
}