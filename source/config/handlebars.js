import express from 'express';
import {engine} from 'express-handlebars';

/**
 * @param {express.Express} app 
 */
export function configHandlebars (app) {
    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set('views', './views');
}