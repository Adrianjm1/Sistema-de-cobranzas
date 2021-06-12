const User = require('./models.js');

function single(attr) {
  return User.findOne(attr)
}

function all(attr) {
  return User.findAll(attr)
}

function create(attr){
  return User.create(attr)
}

module.exports = {
  single,
  all,
  create
}
