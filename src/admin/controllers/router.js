const Router = require('express').Router();
const Controller = require('./index.js');

Router.post('/login', Controller.login);
Router.post('/make', Controller.signUp);
Router.get('/', Controller.getAll);

/* 
Router.get('/', Controller.getAll);
Router.get('/make', Controller.make);
Router.get('/:id', Controller.getOne); */

module.exports = Router
