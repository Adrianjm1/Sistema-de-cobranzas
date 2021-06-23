const Payments = require('./models.js');

function single(attr) {
  return Payments.findOne(attr)
}

function allPaymentsByLocal(attr) {
  return Payments.findAll(attr);
}

function getSumPayments(attr) {
  return Payments.findAll(attr);
}

function create(attr){
  return Payments.create(attr)
}

function updatePay(attr, where){
  return Payments.update(attr, where)
}

function deletePay(where){
  return Payments.destroy(where)
}

module.exports = {
  single,
  create,
  allPaymentsByLocal,
  deletePay,
  updatePay,
  getSumPayments

}
