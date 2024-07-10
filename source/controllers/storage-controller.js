import busboy from "busboy";
import Storage from "../models/storage-model.js";
import { validateSchema } from "../schema-validator.js";

function formatDate(date) {
    const month = ((date.getMonth() < 9) ? '0' : '') + date.getMonth();
    const str = date.getFullYear() + '-' + month + '-' + date.getDate();
    return str;
}

async function uploadFile(req, res, next) {

    const buf = [];
    let listener;

    try {
        listener = busboy({ headers: req.headers });
    }
    catch (error) {
        return next(error);
    }

    listener.on('file', (field, stream, info) => {

        stream.on('data', chunk => {
            buf.push(chunk);
        });

        stream.on('close', async () => {
            try {
                const {filename} = info;
                const owner = req.session.user;
                const fileData = Buffer.concat(buf);

                validateSchema(req.method, '/storage', fileData);

                const {id, createdAt} = await Storage.storeFile(filename, owner, fileData)

                res.header('Location', 'storage/' + id);
                res.status(201);
                res.json({
                    file: {
                        id,
                        name: filename,
                        owner,
                        size: fileData.byteLength,
                        createdAt: formatDate(createdAt)
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
    });

    req.pipe(listener);
}

async function listFiles(req, res, next) {
    try {
        const owner = req.session.user;
        const files = await Storage.listFiles(owner);

        res.status(200);
        res.json({
            files: files.map(file => {
                return {
                    id: file.id,
                    name: file.filename,
                    owner,
                    size: file.size,
                    createdAt: formatDate(file.createdAt)
                }
            })
        });
    }
    catch (error) {
        next(error);
    }
}

async function requestDownload(req, res, next) {
    try {
        const fileId = req.params.id;
        const token = await Storage.createDownloadToken(fileId);

        res.status(200);
        res.header('Location', `storage/${fileId}?token=${token}`);
        res.json({ token });
    }
    catch (error) {
        return next(error);
    }
}

async function downloadFile(req, res, next) {
    /* Una descarga directa envia el archivo tal como se encuentra en la DB y usa la configuracion HTTP
     * {Content-Disposition = attachment} para que el gestor de descargas del navegador del cliente sea quien
     * administre el progreso de la descarga. Este tipo de descarga puede ser solicitada pasando un token
     * de descarga de unico uso y asi poder generar links de descarga seguros sin uso de la cabecera Authorization. */
    const direct = req.session.directDownload;
    if (direct) {
        return downloadFileAsBinary(req, res, next);
    }

    try {
        const fileId = req.params.id;
        const {filename, size, createdAt, data} = await Storage.readFile(fileId);

        res.status(200);
        res.json({
            file: {
                id: fileId,
                name: filename,
                owner: req.session.user,
                size: size,
                createdAt: formatDate(createdAt),
                data: data.toString('base64')
            }
        });
    }
    catch (error) {
        next(error);
    }
}

async function downloadFileAsBinary(req, res, next) {
    try {
        const fileId = req.params.id;
        const {filename, data} = await Storage.readFile(fileId);

        res.status(200);
        res.type('application/octet-stream');
        res.header('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(data);
    }
    catch (error) {
        next(error);
    }
}

async function deleteFile(req, res, next) {
    try {
        const fileId = req.params.id;
        await Storage.deleteFile(fileId);
        res.status(200);
        res.json({});
    }
    catch (error) {
        next(error);
    }
}

export default {
    listFiles,
    uploadFile,
    requestDownload,
    downloadFile,
    deleteFile
}