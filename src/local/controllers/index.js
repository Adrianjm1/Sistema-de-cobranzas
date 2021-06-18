const Local = require('../domain')
const Owner = require('../../owner/domain/model')
const { Id, Schema } = require('../validations');
const LagoMallData = require('../../lagomalldata/domain/models');
const { Sequelize } = require('../../database/domain');

async function getAll(req, res){
  try {
    const data = await Local.all();
    console.log(data['monthlyUSD'][0]);
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
      attributes: ['name', 'code', 'percentageOfCC', 'monthlyUSD', 'prontoPago'],
      include: [{ model: LagoMallData, attributes: ['discount'] }, { model: Owner, attributes: ['firstName', 'lastName'] }],        
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


async function updateTable(req, res){

    try {

      // DIA DEL MES PARA DIFERENCIAR ENTRE COBRAR PRONTO PAGO Y MONTO COMPLETP (A DISCUSION)
      let updatedData = [];
      let date= new Date();
      let day = date.getDate();

      const data = await Local.all({
        attributes: ['monthlyUSD', 'code', 'prontoPago', 'percentageOfCC', 'balance'],

      });

      const LGdata = await LagoMallData.findAll({
        attributes: ['breakeven', 'meter','discount']
      });
      
      let condominio = (LGdata[0].breakeven * LGdata[0].meter);  // MONTO DEL CONDOMINIO
      let discount = LGdata[0].discount;
      
      

      data.map(datos => {
        datos.monthlyUSD = (datos.percentageOfCC * condominio).toFixed(2);  //CALCULO DE CUOTA MENSUAL
        datos.monthlyUSD = Math.round( datos.monthlyUSD);               //REDONDEAR LOS DATOS ANTES DE REALIZAR EL UPDATE
        datos.prontoPago = (datos.monthlyUSD - (datos.monthlyUSD * (discount/100))).toFixed(2);
        datos.prontoPago = Math.round( datos.prontoPago);               
        

        if (day < 12){          //SI EL DIA ES MENOR AL ESTABLECIDO, ENTONCES COBRAR PRONTOPAGO, SINO, MONTO COMPLETO

          datos.balance = datos.balance - datos.prontoPago;

          for(let i=0; i<data.length; i++){
            updatedData =  Local.updateTab( {monthlyUSD: data[i].monthlyUSD }, {where: {code: data[i].code}});  
            updatedData =  Local.updateTab( {prontoPago: data[i].prontoPago, balance: data[i].balance }, {where: {code: data[i].code}});     
          }

        } else {

          datos.balance = datos.balance - datos.monthlyUSD

          for(let i=0; i<data.length; i++){
            updatedData =  Local.updateTab( {monthlyUSD: data[i].monthlyUSD, balance: data[i].balance  }, {where: {code: data[i].code}});  
            updatedData =  Local.updateTab( {prontoPago: data[i].prontoPago}, {where: {code: data[i].code}});     
          }

        }
        

      });

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
  updateTable,
  
}
