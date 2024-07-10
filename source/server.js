import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import './config/schemas.js';
import index_router from './routes/index.js';
import not_found from './middleware/not-found.js';
import error_handler from './middleware/error-handler.js';
import globals from './config/globals.js';

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(index_router);
app.use(not_found);
app.use(error_handler);

app.listen(globals.SERVER_PORT, () => {
    console.log('Server running on port ' + globals.SERVER_PORT);
});