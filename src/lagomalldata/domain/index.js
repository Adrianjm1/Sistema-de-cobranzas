 const Lagomalldata = require('./models');
 

function all(attr) {
  return Lagomalldata.findAll(attr)
}

function updateBE(attr, where) {
  return Lagomalldata.update(attr, where)
}



function make(attr) {
  return Lagomalldata.create(attr)
}




module.exports = {
  all,
  updateBE,
  make

}
