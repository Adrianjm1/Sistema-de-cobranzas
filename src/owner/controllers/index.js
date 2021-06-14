const Owner = require('../domain')
const { Id, Schema } = require('../validations')

async function getAll(req, res){
  try {
    const data = await Owner.all();
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

async function getOne(req, res){
  try {
    const { id } = await Id.validateAsync(req.params);
    const data = await Owner.single({
      where: {id: id}
    });
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

async function make(req, res){
  try {
    const body = await Schema.validateAsync(req.body);
    const data = await Owner.create(body);
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

module.exports = {
  getAll,
  getOne,
  make
}
