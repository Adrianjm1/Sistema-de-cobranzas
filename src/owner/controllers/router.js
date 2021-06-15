const Router = require('express').Router();
const Controller = require('./index.js');

Router.get('/', Controller.getAll)
Router.get('/make', Controller.make)
Router.get('/:id', Controller.test)

module.exports = Router
