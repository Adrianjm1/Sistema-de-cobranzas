const { Op } = require('sequelize')
const Local = require('../domain/index');
const Owner = require('../../owner/domain/model');
const { Id, Schema, Month, Pronto } = require('../validations');
const LagoMallData = require('../../lagomalldata/domain/models');
const LMDFunctions = require('../../lagomalldata/domain/index');
const { Sequelize } = require('../../database/domain');

async function getTable(req, res){
  try {
      const data = await Local.all({
      attributes: ['name', 'code', 'percentageOfCC', 'monthlyUSD', 'balance'],
      include: [{ model: Owner, attributes: ['firstName', 'lastName'] }]
                    
    });
    res.send(data)
  } catch (e) {
     res.status(400).send({error: e.message})
  }
}

async function getTableMonthly(req, res){

  let date = req.body.month + '-01';
  
  let dateMax = req.body.month + '-30';

  console.log(date);
  try {

      const data = await Local.all({
      attributes: ['name', 'code', 'percentageOfCC', 'monthlyUSD', 'prontoPago'],
      include: [{ model: Owner, attributes: ['firstName', 'lastName'] }],        
      });


      const LGdata = await LagoMallData.findOne({   where: {month: {   [Op.between]: [date, dateMax]    }}});


      let condominio = (LGdata.breakeven * LGdata.meter);  // MONTO DEL CONDOMINIO
      let discount = LGdata.discount;

      data.map(datos => {
        datos.monthlyUSD = (datos.percentageOfCC * condominio).toFixed(2);  //CALCULO DE CUOTA MENSUAL
        datos.monthlyUSD = Math.round( datos.monthlyUSD);               //REDONDEAR LOS DATOS ANTES DE REALIZAR la consulta
        datos.prontoPago = (datos.monthlyUSD - (datos.monthlyUSD * (discount/100))).toFixed(2);
        datos.prontoPago = Math.round( datos.prontoPago);               
        

      });

      res.send(data)

  } catch (e) {
    res.status(400).send({error: e.message})
  }
}


async function updateBalance(req, res){

  try {

    const code = req.params.code;
    const balance = req.body.balance;
  
    const data =  Local.updateTab( {balance}, {where: {code}});  

    res.send(data);

    

  } catch (e) {
    res.status(400).send({error: e.message})
  }

}



async function updateTable(req, res){

    try {

      
      let date = req.body.month + '-01';
      
      let dateMax = req.body.month + '-30';

      // DIA DEL MES PARA DIFERENCIAR ENTRE COBRAR PRONTO PAGO Y MONTO COMPLETP (A DISCUSION)
      let body = await Pronto.validateAsync(req.body);

      let updatedData = [];
      let dayAux= new Date();
      let day = dayAux.getDate();

      console.log(day);

      const data = await Local.all({
        attributes: ['name','monthlyUSD', 'code', 'prontoPago', 'percentageOfCC', 'balance'],
        

      });

      const LGdata = await LagoMallData.findOne({   where: {month: {   [Op.between]: [date, dateMax]    }}});

      if(!data || !LGdata){

        return res.send({
          ok: false,
          resp: 'Fecha invalida'      //Se colocan los parentesis de muestra, pero se deben quitar
        })

      } else {


        let condominio = (LGdata.breakeven * LGdata.meter);  // MONTO DEL CONDOMINIO
        let discount = LGdata.discount;
        
        
  
        data.map(datos => {
          datos.monthlyUSD = (datos.percentageOfCC * condominio).toFixed(2);  //CALCULO DE CUOTA MENSUAL
          datos.monthlyUSD = Math.round( datos.monthlyUSD);               //REDONDEAR LOS DATOS ANTES DE REALIZAR EL UPDATE
          datos.prontoPago = (datos.monthlyUSD - (datos.monthlyUSD * (discount/100))).toFixed(2);
          datos.prontoPago = Math.round( datos.prontoPago);               
          
  
          if (day < body.diaProntoPago){          //SI EL DIA ES MENOR AL ESTABLECIDO, ENTONCES COBRAR PRONTOPAGO, SINO, MONTO COMPLETO
  
            datos.balance = datos.balance - datos.prontoPago;
  
            for(let i=0; i<data.length; i++){
              updatedData =  Local.updateTab( {monthlyUSD: data[i].monthlyUSD, idLGData: LGdata.id }, {where: {code: data[i].code}});  
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

      }
      

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
  getTable,
  getOne,
  make,
  getTableMonthly,
  updateTable,
  updateBalance
  
}
