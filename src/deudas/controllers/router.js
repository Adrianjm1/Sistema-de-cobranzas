const Router = require('express').Router();
const Controller = require('./index.js');
const {validToken} = require('../../admin/controllers/middleware');

Router.get('/getDeudas', validToken, Controller.getDeudas);
Router.get('/getDeudasRango', validToken, Controller.getDeudasRango);
Router.get('/getDeudasDesde', validToken, Controller.getDeudasDesde);
Router.post('/updateDeuda', validToken, Controller.updateOrDeleteDeuda);


module.exports = Router;
