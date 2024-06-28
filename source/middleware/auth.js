import JWT from 'jsonwebtoken';
import { APIError } from '../errors.js';
import globals from '../config/globals.js';

export default function(req, res, next) {
    if (req.session) {
        return next();
    }
    const token = req.header('Authorization');
    if (! token) {
        return next(APIError.ERR_ACCESS_DENIED());
    }

    JWT.verify(token, globals.JWT_AUTH_SECRET, (error, payload) => {
        if (error || payload.user == null) {
            return next(APIError.ERR_INVALID_TOKEN());
        }
        
        req.session = req.session || {};
        req.session.user = payload.user;
        next();
    });
}