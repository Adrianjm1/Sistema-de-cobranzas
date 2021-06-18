const Local = require('./models')
const { Op } = require("sequelize");


function single(attr) {
  return Local.findOne(attr)
}

function all(attr) {
  return Local.findAll(attr)
}

function create(attr){
  return Local.create(attr)
}

function updateTab(attr,where) {

  return Local.update(attr, where);
  
}
module.exports = {
  single,
  all,
  create,
  updateTab
}
