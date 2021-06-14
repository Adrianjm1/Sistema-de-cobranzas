 const Lagomalldata = require('./models');
 

function all(attr) {
  return Lagomalldata.findAll(attr)
}



module.exports = {
  all

}
