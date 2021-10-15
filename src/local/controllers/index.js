const { Op, sequelize } = require('sequelize');
const Local = require('../domain/index');
const Payments = require('../../payments/domain');
const Owner = require('../../owner/domain/model');
const deudasFunctions = require('../../deudas/domain/index');
const { Id, Schema, Month, Pronto } = require('../validations');
const LagoMallData = require('../../lagomalldata/domain/models');
const LMDFunctions = require('../../lagomalldata/domain/index');
const { Sequelize } = require('../../database/domain');

async function getTable(req, res) {
  try {
    // let mesaux = new Date();


    // let mes = mesaux.getFullYear() + '-' + (mesaux.getMonth() + 1)


    // console.log(mes);


    const data = await Local.all({
      attributes: ['name', 'code', 'percentageOfCC', 'monthlyUSD', 'balance', 'prontoPago'],
      include: [{ model: Owner, attributes: ['firstName', 'lastName'] }]

    });

    const deudas = await Local.all({
      attributes:
        [
          [Sequelize.fn('sum', Sequelize.col('monthlyUSD')), 'total'],
          [Sequelize.fn('sum', Sequelize.col('prontoPago')), 'totalPronto']]

    });



    res.send({ data: data, deudas: deudas })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}


async function getTableMonthly(req, res) {

  let date = req.params.mes + '-01';

  let dateMax = req.params.mes + '-30';

  try {

    const data = await Local.all({
      attributes: ['name', 'code', 'percentageOfCC', 'monthlyUSD', 'prontoPago', 'balance'],
      include: [{ model: Owner, attributes: ['firstName', 'lastName'] }],
    });


    const LGdata = await LagoMallData.findAll({ where: { month: { [Op.between]: [date, dateMax] } } });

    let condominio = (LGdata[0].breakeven * LGdata[0].meter);  // MONTO DEL CONDOMINIO
    let discount = LGdata[0].discount;

    data.map(datos => {
      datos.monthlyUSD = (datos.percentageOfCC * condominio).toFixed(2);  //CALCULO DE CUOTA MENSUAL
      datos.monthlyUSD = Math.round(datos.monthlyUSD);               //REDONDEAR LOS DATOS ANTES DE REALIZAR la consulta
      datos.prontoPago = (datos.monthlyUSD - (datos.monthlyUSD * (discount / 100))).toFixed(2);
      datos.prontoPago = Math.round(datos.prontoPago);

    });

    res.send(data)

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}


async function updateBalance(req, res) {

  try {

    const code = req.body.code;
    const balance = req.body.balance;

    const data = Local.updateTab({ balance }, { where: { code } });

    res.send(data);



  } catch (e) {
    res.status(400).send({ error: e.message })
  }

}



async function updateTable(req, res) {

  try {


    let date = req.body.month + '-01';

    let dateMax = req.body.month + '-27';

    let pagos = [];

    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const currentDate = new Date(Date.now());
    const numberMonth = req.body.month.slice(5, 7);
    const numberYear = req.body.month.slice(0,4);
    const numberMonth1 = parseInt(numberMonth);

    // DIA DEL MES PARA DIFERENCIAR ENTRE COBRAR PRONTO PAGO Y MONTO COMPLETP (A DISCUSION)
    let body = await Pronto.validateAsync(req.body);

    let updatedData = [];
    let dayAux = new Date();
    let day = dayAux.getDate();


    const data = await Local.all({
      attributes: ['id', 'name', 'monthlyUSD', 'code', 'prontoPago', 'percentageOfCC', 'balance']
    });

    const LGdata = await LagoMallData.findOne({
      where: { month: { [Op.between]: [date, dateMax] } }, order: [
        ['id', 'DESC'],
      ],
      limit: 1
    });

    if (!data || !LGdata) {

      console.log(data + '   ' + LGdata);

      return res.send({
        ok: false,
        resp: 'Fecha invalida'      //Se colocan los parentesis de muestra, pero se deben quitar
      })

    } else {

      let condominio = (LGdata.breakeven * LGdata.meter);  // MONTO DEL CONDOMINIO
      let discount = LGdata.discount;


      for(let i=0; i<data.length; i++){

        data[i].monthlyUSD = (data[i].percentageOfCC * condominio).toFixed(2);  //CALCULO DE CUOTA MENSUAL
        data[i].monthlyUSD = Math.round(data[i].monthlyUSD);               //REDONDEAR LOS DATOS ANTES DE REALIZAR EL UPDATE
        data[i].prontoPago = (data[i].monthlyUSD - (data[i].monthlyUSD * (discount / 100))).toFixed(2);
        data[i].prontoPago = Math.round(data[i].prontoPago);

        let balanceAntes = data[i].balance;

        data[i].balance = parseFloat(data[i].balance) + parseFloat(data[i].monthlyUSD);


        if ((balanceAntes > 0) && (data[i].code != '0000')) {

          const deudaLocal = await deudasFunctions.all({
            attributes: ['id', 'amountUSD', 'month', 'idLocal'],
            where: { idLocal: data[i].id },
            order: [
              ['id', 'ASC'],
            ]
      
          });

          if (deudaLocal.length > 0){

            let sumaDeudas = 0;

            for(let i=0; i<deudaLocal.length; i++){

              sumaDeudas = sumaDeudas + parseFloat(deudaLocal[i].amountUSD);

            }

            balanceAntes = balanceAntes - sumaDeudas;

            const deuda = {
              amountUSD: balanceAntes,
              month: `${parseInt(numberMonth) < 10 ? `0${parseInt(numberMonth)}` : `${parseInt(numberMonth)}`}-${numberYear}`,
              idLocal: data[i].id
            }
  
            deudasFunctions.create(deuda);


          } else{

            const balanceDeuda = parseFloat(data[i].balance) - parseFloat(data[i].monthlyUSD);

            const deuda = {
              amountUSD: balanceDeuda,
              month: `${parseInt(numberMonth) < 10 ? `0${parseInt(numberMonth)}` : `${parseInt(numberMonth)}`}-${numberYear}`,
              idLocal: data[i].id
            }
  
            deudasFunctions.create(deuda);

          }
          
        }


      }

      for (let i = 0; i < data.length; i++) {
        updatedData = Local.updateTab({ monthlyUSD: data[i].monthlyUSD, balance: data[i].balance }, { where: { code: data[i].code } });
        updatedData = Local.updateTab({ prontoPago: data[i].prontoPago, idLGData: LGdata.id }, { where: { code: data[i].code } });


        const createPayment = {
          amountUSD: -data[i].monthlyUSD,
          referenceNumber: null,
          bank: 'Cuota mensual',
          idLocal: data[i].id,
          idAdmin: 1,
          exchangeRate: 1,
          paymentUSD: true,
          date: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : `${currentDate.getMonth() + 1}`}-${currentDate.getDate()}`,
          description: `Cobro referente al mes de ${meses[numberMonth1 - 1]}`,
          restanteUSD: data[i].balance,
          nota: 0
        }

        const pago = await Payments.create(createPayment);
        pagos.push(pago);


      }

      console.log(data.length);
      res.send(data);

    }


  } catch (e) {
    res.status(400).send({ error: e.message })
    console.log(e);
  }

}



async function make(req, res) {
  try {
    const body = await Schema.validateAsync(req.body);
    const data = await Local.create(body);
    res.send(data)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}


async function findOne(req, res) {


  const idLocal = req.query.idLocal

  try {
    const data = await Local.BuscarUno({ where: { id:idLocal } });
    if (data === null) {
      console.log('Not found!');
    } 
    res.send(data)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}





module.exports = {
  getTable,
  make,
  getTableMonthly,
  updateTable,
  updateBalance,
  findOne
}
