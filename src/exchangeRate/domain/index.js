const Exchange = require('./model.js');

function single(attr) {
  return Exchange.findOne(attr)
}

function all(attr) {
  return Exchange.findAll(attr)
}

function create(attr){
  return Exchange.create(attr)
}

module.exports = {
  single,
  all,
  create
}
