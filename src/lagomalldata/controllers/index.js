const Lagomalldata = require('../domain')
const { Id, Schema } = require('../validations')

async function getAll(req, res){
  try {
    const data = await Lagomalldata.all();
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

module.exports = {
  getAll
}
