const Deudas = require('./models.js');

function single(attr) {
  return Deudas.findOne(attr)
}

function all(attr) {
  return Deudas.findAll(attr);
}

function create(attr){
  return Deudas.create(attr)
}

function updateDeuda(attr, where){
  return Deudas.update(attr, where)
}

function deleteDeuda(where){
  return Deudas.destroy(where)
}

function PagoMasDeuda(where){
  return Deudas.update(where)
}

module.exports = {
  single,
  create,
  all,
  deleteDeuda,
  updateDeuda,
  PagoMasDeuda
}