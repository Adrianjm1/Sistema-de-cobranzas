const Payments = require('./models.js');

function single(attr) {
  return Payments.findOne(attr)
}

function all(attr) {
  return Payments.findAll(attr)
}

function create(attr){
  return Payments.create(attr)
}

module.exports = {
  single,
  all,
  create
}
