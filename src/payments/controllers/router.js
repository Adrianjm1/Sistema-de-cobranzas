const Router = require('express').Router();
const Controller = require('./index.js');
const {validToken} = require('../../admin/controllers/middleware');


Router.post('/make', validToken, Controller.make);

Router.put('/up/:reference', validToken, Controller.updatePayment);

Router.delete('/de/:reference', validToken, Controller.deletePayment);

Router.get('/:code', validToken, Controller.getPaymentsByLocal);

Router.get('/get/month/:mes', validToken, Controller.getPaymentsByMonth);

Router.get('/get/monthly/:mes', validToken, Controller.getPaymentsMonthly);

Router.patch('/suma', validToken, Controller.getAllPayments);


module.exports = Router;
