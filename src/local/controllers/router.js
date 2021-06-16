const Router = require('express').Router();
const Controller = require('./index.js');

Router.get('/', Controller.getTableMonthly);
Router.get('/table', Controller.getTable);
Router.get('/make', Controller.make);
Router.get('/:id', Controller.getOne);

module.exports = Router
