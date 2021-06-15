const Owner = require('./model')


function single(attr) {
  return Owner.findOne(attr)
}

function all(attr) {
  return Owner.findAll(attr)
}

function create(attr){
  return Owner.create(attr)
}


module.exports = {
  single,
  all,
  create
}
