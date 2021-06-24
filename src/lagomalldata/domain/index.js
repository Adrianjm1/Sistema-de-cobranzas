 const Lagomalldata = require('./models');
 

function all(attr) {
  return Lagomalldata.findAll(attr)
}

function updateBE(attr, where) {
  return Lagomalldata.update(attr, where)
}



module.exports = {
  all,
  updateBE

}
