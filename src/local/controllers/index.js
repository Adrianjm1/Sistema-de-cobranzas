const Local = require('../domain')
const Owner = require('../../owner/domain/model')
const { Id, Schema } = require('../validations');
const LagoMallData = require('../../lagomalldata/domain/models');
const { Sequelize } = require('../../database/domain');

async function getAll(req, res){
  try {
    const data = await Local.all();
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

async function getTable(req, res){
  try {
      const data = await Local.all({
      attributes: ['name', 'percentageOfCC', 'monthlyUSD', 'balance'],
      include: [{ model: Owner, attributes: ['firstName', 'lastName'] }]
                    
    });
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

async function getTableMonthly(req, res){
  try {
      const data = await Local.all({
      attributes: ['name', 'code', 'percentageOfCC', 'monthlyUSD'],
      include: [{ model: Owner, attributes: ['firstName', 'lastName'] }],
      include: [{ model: LagoMallData, attributes: ['discount', [Sequelize.literal('monthlyUSD - (monthlyUSD * (discount/100))'), 'MontoProntopago']] }],
                    



    });




    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}


async function getOne(req, res){
  try {
    const { id } = await Id.validateAsync(req.params);
    const data = await Local.single({
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
    const data = await Local.create(body);
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

module.exports = {
  getAll,
  getOne,
  make,
  getTable,
  getTableMonthly
}
