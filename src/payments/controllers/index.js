const Payments = require('../domain')
const { Id, Schema } = require('../validations')

async function getAll(req, res){
  try {
    const data = await Payments.all({
      //attributes: ['name', 'code', 'percentageOfCC', 'monthlyUSD'],
    });
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

async function getOne(req, res){
  try {
    const { id } = await Id.validateAsync(req.params);
    const data = await Payments.single({
      where: {age: id}
    });
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

async function make(req, res){
  try {
    const body = await Schema.validateAsync(req.body);
    const data = await Payments.create(body);
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
