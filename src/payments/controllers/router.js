const Router = require('express').Router();
const Controller = require('./index.js');


Router.post('/make', Controller.make);

Router.put('/up/:reference', Controller.updatePayment);

Router.delete('/de/:reference', Controller.deletePayment);

Router.get('/:code', Controller.getPaymentsByLocal);

Router.patch('/suma', Controller.getAllPayments);


module.exports = Router;
