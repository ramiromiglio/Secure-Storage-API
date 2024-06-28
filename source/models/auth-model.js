import db from '../db.js';
import bcrypt from 'bcrypt';
import { APIError } from '../errors.js';

export default class User {

    static async exists(username) {
        const stmt = `
            SELECT username
            FROM users
            WHERE username = $1
        `;
        const result = await db.query(stmt, [username]);
        return result.rows.length !== 0;
    }

    static async signUp(username, password) {        

        if (await this.exists(username)) {
            throw APIError.ERR_USERNAME_CONFLICT();
        }

        const hash = await bcrypt.hash(password, 10);
        const args = [username, hash];
        const stmt = `
            INSERT INTO users (username, password)
            VALUES($1, $2)
        `;
        return db.query(stmt, args);
    }
    
    static async signIn(username, password) {

        if (! await this.exists(username)) {
            throw APIError.ERR_USERNAME_NOT_FOUND();
        }

        const stmt = `
            SELECT password
            FROM users
            WHERE username = $1
        `;
        const result = await db.query(stmt, [username]);
        const hash = result.rows[0].password;
        const match = await bcrypt.compare(password, hash);

        if (! match) {
            throw APIError.ERR_INVALID_PASSWORD();
        }
    }
}