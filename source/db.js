import pg from 'pg';
import globals from './config/globals.js';

const pool = new pg.Pool({
    host: globals.DB_HOST,
    user: globals.DB_USER,
    password: globals.DB_PASS,
    database: globals.DB_NAME,
    port: globals.DB_PORT,
});

export default pool;