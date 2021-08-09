const Router = require('express').Router();
const Controller = require('./index.js');
const {validToken} = require('../../admin/controllers/middleware');

Router.get('/getDeudas', validToken, Controller.getDeudas);


module.exports = Router;
