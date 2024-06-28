import { APIError } from "../errors.js";

export default function(error, req, res, next) {
    if (! (error instanceof APIError)) {
        error = APIError.ERR_INTERNAL_SERVER();
    }
    res.status(error.httpStatusCode);
    res.json({ error });
}