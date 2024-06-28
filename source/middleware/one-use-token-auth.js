import Storage from "../models/storage-model.js";
import { APIError } from "../errors.js";

export default async function (req, res, next) {
    /* Con esta comprobacion permito que este middleware pueda establecerse antes o despues de
     * otro middleware de autenticacion como {auth} en una misma ruta. */
    if (req.session) {
        return next();
    }
    const token = req.query.token;
    if (req.session || ! token) {
        return next();
    }
    else if (typeof token !== 'string') {
        return next(APIError.ERR_INVALID_TOKEN());
    }
    try {
        const fileId = req.params.id;
        await Storage.useToken(token, fileId);
        req.session = req.session || {};
        req.session.directDownload = true;
        next();
    }
    catch (error) {
        next(error);
    }
}