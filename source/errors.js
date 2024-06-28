class APIError extends Error {
    static ERR_USERNAME_CONFLICT  = () => new APIError(409, '/auth/username-conflict');
    static ERR_USERNAME_NOT_FOUND = () => new APIError(404, '/auth/username-not-found');
    static ERR_INVALID_PASSWORD   = () => new APIError(401, '/auth/invalid-password');
    static ERR_ACCESS_DENIED      = () => new APIError(403, '/auth/access-denied');
    static ERR_INVALID_TOKEN      = () => new APIError(401, '/auth/invalid-token');
    static ERR_INVALID_SCHEMA     = (details) => new APIError(400, '/invalid-schema', details);
    static ERR_INTERNAL_SERVER    = () => new APIError(500, '/internal-server');
    static ERR_FILE_NOT_FOUND     = () => new APIError(404, '/storage/file-not-found');
    static ERR_EXPIRED_TOKEN      = () => new APIError(401, '/storage/expired-token');
    static ERR_USED_TOKEN         = () => new APIError(401, '/storage/used-token');

    constructor(statusCode, type, details = undefined) {
        super();
        this.type = type;
        this.httpStatusCode = statusCode;
        this.details = details;
    }

    toJSON() {
        return {
            type: this.type,
            details: this.details || undefined
        }
    }
}

export {
    APIError,
}