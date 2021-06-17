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

function update(attr) {
  return Local.update(attr)
  
}
module.exports = {
  single,
  all,
  create,
  update
}
