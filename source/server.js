import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import morgan from 'morgan';
import './config/schemas.js';
import index_router from './routes/index.js';
import not_found from './middleware/not-found.js';
import error_handler from './middleware/error-handler.js';
import globals from './config/globals.js';

const print = console.log;
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = globals.API_SERVER_PORT;
const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(index_router);
app.use(not_found);
app.use(error_handler);

app.listen(PORT, () => {
    print('Server running on http://localhost:' + PORT);
});