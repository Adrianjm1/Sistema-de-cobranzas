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
      include: [{ model: LagoMallData, attributes: ['discount', [Sequelize.literal('monthlyUSD - (monthlyUSD * (discount/100))'), 'prontoPago']] }, { model: Owner, attributes: ['firstName', 'lastName'] }],        
      });

      data[1].lagoMallDatum.discount = 1000;
      data[1].lagoMallDatum.prontoPago = "10";

/*       data.update({prontoPago:2}, {where: {id: 2}});
 */

      res.send(data)

  } catch (e) {
    res.status(400).send({error: e.message})
  }
}


async function updatePP(req, res){

    try {

      const discount = req.body.discount;

      const data = await Local.all({
        attributes: ['monthlyUSD', 'code', 'prontoPago']
      });

      data.map(datos => {
        datos.prontoPago = (datos.monthlyUSD - (datos.monthlyUSD * (discount/100))).toFixed(2);
      })

      let updatedData = [];

      for(let i=0; i<data.length; i++){

        updatedData = await Local.updatePronto( {prontoPago: data[i].prontoPago }, {where: {code: data[i].code}});

      }

      res.send(data);

    } catch (e) {
      res.status(400).send({error: e.message})
    }

  }
  

async function getOne(req, res){
  try {
    const { id } = await Id.validateAsync(req.params);
    const data = await Local.single({
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
  getTableMonthly,
  updatePP,
  
}
