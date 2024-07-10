import db from '../db.js';
import crypto from 'node:crypto';
import JWT from 'jsonwebtoken';
import { APIError } from '../errors.js';
import globals from '../config/globals.js';

export default class Storage {

    static async exists(id) {
        const stmt = `
            SELECT id
            FROM storage
            WHERE id = $1
        `;

        return db.query(stmt, [id]).then(result => {
            return result.rows.length > 0;
        });
    }

    static async genUniqueId() {
        while (true) {
            const buf = crypto.randomBytes(8);
            const uuid = buf.toString('hex');
            if (! await this.exists(uuid)) {
                return uuid;
            }
        }
    }

    /** Genera un JWT unico y de corta duracion para el archivo {fileId}. Este token es utilizado
      * para generar links de descarga de un solo uso. Tambien se almacena la fecha de creacion para
      * limpiar la tabla periodicamente cuando los tokens ya no son validos.
      */
    static async createDownloadToken(fileId) {
        if (! await this.exists(fileId)) {
            throw APIError.ERR_FILE_NOT_FOUND();
        }

        const token = JWT.sign({
            fileId,
            /* La fecha funciona como un <salt> para generar un token diferente aunque se solicite
             * para el mismo archivo. */
            date: new Date().toUTCString()
        }, globals.JWT_ONE_USE_SECRET, {expiresIn: '12h'});

        const stmt = `
            INSERT INTO jwtokens (token)
            VALUES ($1)
        `;

        return db.query(stmt, [token]).then(result => {
            return token
        });
    }

    /** Verifica que el token sea valido, que este haga referencia a {fileId} y que no se haya usado antes.
      */
    static async useToken(token, fileId) {
        try {
            const payload = JWT.verify(token, globals.JWT_ONE_USE_SECRET);
            if (! payload.fileId || typeof payload.fileId !== 'string' || payload.fileId !== fileId)
                throw null;
        }
        catch (error) {
            if (error instanceof JWT.TokenExpiredError)
                throw APIError.ERR_EXPIRED_TOKEN();
            else {
                throw APIError.ERR_INVALID_TOKEN();
            }
        }

        const stmt = `
            DELETE FROM jwtokens
            WHERE token = $1
        `;

        const result = await db.query(stmt, [token]);
        if (result.rowCount !== 1) {
            throw APIError.ERR_USED_TOKEN();
        }
    }

    static async storeFile(filename, owner, buffer) {
        const uuid = await this.genUniqueId();
        const args = [uuid, filename, owner, buffer.byteLength, buffer];
        const stmt = `
            INSERT INTO storage (id, filename, owner, size, data)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING created_at
        `;
        return db.query(stmt, args).then(result => {
            return {
                id: uuid,
                createdAt: result.rows[0].created_at
            }
        });
    }

    static async listFiles(owner) {
        const stmt = `
            SELECT id, filename, size, created_at AS "createdAt"
            FROM storage
            WHERE owner = $1
        `;
        return db.query(stmt, [owner]).then(
            results => results.rows
        );
    }

    static async readFile(id) {
        const stmt = `
            SELECT filename, size, created_at AS "createdAt", data
            FROM storage
            WHERE id = $1
        `;
        return db.query(stmt, [id]).then(results => {
            if (results.rowCount === 0)
                throw APIError.ERR_FILE_NOT_FOUND();
            return results.rows[0];
        });
    }

    static async deleteFile(id) {
        if (! await this.exists(id)) {
            throw APIError.ERR_FILE_NOT_FOUND();
        }
        const stmt = `
            DELETE FROM storage
            WHERE id = $1
        `;
        return db.query(stmt, [id]);
    }
}