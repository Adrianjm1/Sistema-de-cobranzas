 const Lagomalldata = require('./models');
 

function all(attr) {
  return Lagomalldata.findAll(attr)
}

function one(attr) {
  return Lagomalldata.findOne(attr)
}


function updateBE(attr, where) {
  return Lagomalldata.update(attr, where)
}

function last (attr){
  return Lagomalldata.findAll(attr)
}



function make(attr) {
  return Lagomalldata.create(attr)
}




module.exports = {
  all,
  updateBE,
  make,
  last

}
