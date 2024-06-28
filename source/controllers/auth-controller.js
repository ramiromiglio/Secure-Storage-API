import User from '../models/auth-model.js';
import JWT from 'jsonwebtoken';
import globals from '../config/globals.js';

/*
El payload de la solicitud debe estar en formato JSON. Esta funcion valida los
datos utilizando Joy y, de ser correctos, comprueba que el usuario aun no se
encuentre registrado. De no estar registrado, inserta un nuevo registro en la
tabla USERS.
*/
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