const Payments = require('./models.js');

function single(attr) {
  return Payments.findOne(attr)
}

function allPaymentsByLocal(attr) {
  return Payments.findAll(attr);
}

function create(attr){
  return Payments.create(attr)
}

module.exports = {
  single,
  create,
  allPaymentsByLocal
}
