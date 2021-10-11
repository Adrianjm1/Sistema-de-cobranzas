const Router = require('express').Router();
const Controller = require('./index.js');
const {validToken, verificaAdminMaster} = require('../../admin/controllers/middleware')

Router.get('/', Controller.getAll);
Router.get('/make', Controller.make);
Router.get('/:id', Controller.getOne); 

module.exports = Router
