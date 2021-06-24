const Router = require('express').Router();
const Controller = require('./index.js');
const {validToken} = require('../../admin/controllers/middleware');

Router.get('/', validToken, Controller.getAll);
Router.patch('/:id', validToken, Controller.updateBreakeven)


module.exports = Router
