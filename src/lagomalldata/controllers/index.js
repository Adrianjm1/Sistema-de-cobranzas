const Lagomalldata = require('../domain')
const { Id, Schema } = require('../validations')
const { Sequelize } = require('sequelize');


async function getAll(req, res){
  try {
    const data = await Lagomalldata.all({attributes: ['month', 'breakeven', 'meter', [Sequelize.literal('meter*breakeven'),'montoDeCondominio'] ] });
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

module.exports = {
  getAll
}
