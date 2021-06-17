const Local = require('./models')
function single(attr) {
  return Local.findOne(attr)
}

function all(attr) {
  return Local.findAll(attr)
}

function create(attr){
  return Local.create(attr)
}

function updatePronto(attr) {
  return Local.update(attr, {where: {prontoPago: 0}})
  
}
module.exports = {
  single,
  all,
  create,
  updatePronto
}
