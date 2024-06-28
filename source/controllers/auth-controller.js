import User from '../models/auth-model.js';
import JWT from 'jsonwebtoken';
import globals from '../config/globals.js';

async function signUp(req, res, next) {
    const { username: user, password: pass } = req.body;
    try {
        await User.signUp(user, pass);
        res.status(201);
        res.json({
            user,
            token: JWT.sign({ user }, globals.JWT_AUTH_SECRET)
        });
    }
    catch (error) {
        next(error);
    }
}

async function signIn(req, res, next) {
    const { username: user, password: pass } = req.body;
    try {
        await User.signIn(user, pass);
        res.status(200);
        res.json({
            user,
            token: JWT.sign({ user }, globals.JWT_AUTH_SECRET)
        });
    }
    catch (error) {
        next(error);
    }
}

export default {
    signUp,
    signIn,
};