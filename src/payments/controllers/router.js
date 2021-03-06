const Router = require('express').Router();
const Controller = require('./index.js');
const {validToken} = require('../../admin/controllers/middleware');


Router.post('/make', validToken, Controller.make);

Router.put('/up/:reference', validToken, Controller.updatePayment);

// Router.delete('/de/:reference', validToken, Controller.deletePayment);

Router.get('/:code', validToken, Controller.getPaymentsByLocal);

Router.get('/get/dayly', validToken, Controller.getPaymentsDayly);

Router.get('/get/monthly', validToken, Controller.getPaymentsMonthly);

Router.get('/sum/usd', validToken, Controller.getSumPaymentsUSD);

Router.patch('/upCode', validToken, Controller.updateCode);

Router.delete('/delete/:id', validToken, Controller.deletePayment);



module.exports = Router;
