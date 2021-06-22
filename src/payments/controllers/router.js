const Router = require('express').Router();
const Controller = require('./index.js');


Router.post('/make', Controller.make);

Router.get('/:code', Controller.getPaymentsByLocal);


module.exports = Router;
