const Local = require('../../local/domain/models');
const LocalFunctions = require('../../local/domain');
const LMDFunctions = require('../../lagomalldata/domain');
const Payments = require('../../payments/domain/models');
const PaymentsFunctions = require('../../payments/domain');
const Deudas = require('../domain');
const { Op } = require("sequelize");
const { Sequelize } = require('../../database/domain');


async function getDeudas(req, res) {
  try {

    const month = req.query.month;

    const data = await Deudas.all({
      attributes: ['id', 'amountUSD', 'month'],
      include: [{ model: Local, attributes: ['name', 'code'] }],
      where: { month: month },
      order: [
        ['id', 'ASC'],
      ]

    });

    if (data.length == 0) {

      return res.send({
        ok: false,
        message: 'Error 1'
      })
    }

    let sumDeudas = 0;

    for (let i=0; i<data.length; i++){

      sumDeudas = sumDeudas + (parseFloat(data[i].amountUSD));

    }

    const mes1 = `${month.slice(3, 7)}-${month.slice(0, 2)}-01`;

    const locales = await LocalFunctions.all({
      attributes: ['name', 'code', 'percentageOfCC', 'monthlyUSD', 'prontoPago', 'balance']
    });

    const LGdata = await LMDFunctions.all({ where: { month: mes1 } });


    if (LGdata.length == 0) {

      return res.send({
        ok: false,
        message: 'Error 2'
      })
    }

    let condominio = (LGdata[0].breakeven * LGdata[0].meter);  // MONTO DEL CONDOMINIO

    let suma = 0

    locales.map(datos => {
      datos.monthlyUSD = (datos.percentageOfCC * condominio).toFixed(2);
      datos.monthlyUSD = Math.round(datos.monthlyUSD);

      suma = suma + datos.monthlyUSD;

    });

    let porcentaje = (sumDeudas * 100) / suma;

    res.send({
      ok: true,
      data,
      sumDeudas,
      porcentaje,
      suma
    });

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}



async function getDeudasRango(req, res) {
  try {

    const month1 = req.query.month1;
    const month2 = req.query.month2;

    const data = await Deudas.all({
      attributes: ['id', 'month', 'amountUSD', [Sequelize.fn('sum', Sequelize.col('amountUSD')), 'deudaTotal']],
      include: [{ model: Local, attributes: ['name', 'code'] }],
      where: { month: {[Op.between]: [month1, month2]} },
      order: [
        ['id', 'ASC'],
      ],
      group: ['code']

    });


    res.send(data);

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}



async function getDeudasDesde(req, res) {
  try {
    const dat = new Date();
    const datt= dat.getFullYear();
    const dattt = dat.getMonth();

    const today = `${dattt}-${datt}`

    const month = req.query.month;

    const dataS = await Deudas.all({
      attributes: ['id', 'month', 'amountUSD', [Sequelize.fn('sum', Sequelize.col('amountUSD')), 'deudaTotal']],
      include: [{ model: Local, attributes: ['name', 'code'] }],
      // where: { month: {[Op.between]: [month, today]} },
      order: [
        ['id', 'ASC'],
      ],
      group: ['code']

    });


    // const dataF = await Deudas.all({
    //   attributes: ['id', 'month', 'amountUSD', [Sequelize.fn('sum', Sequelize.col('amountUSD')), 'deudaTotal']],
    //   include: [{ model: Local, attributes: ['name', 'code'] }],
    //   where: { month: month },
    //   order: [
    //     ['id', 'ASC'],
    //   ],
    //   group: ['code']

    // });


    const data = dataS.filter(datos =>datos.month == month)


    res.send(data);

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}


async function updateOrDeleteDeuda(req, res) {
  try {

    const body = req.body;

    const data = await LocalFunctions.single({
      attributes: ['id', 'balance'],
      where: { code: body.code }
    });

    if (!data) {

      return res.send({
        ok: false,
        message: 'El codigo ingresado no existe'
      })
    }

    const data2 = await Deudas.single({
      attributes: ['id', 'amountUSD', 'month'],
      include: [{ model: Local, attributes: ['name', 'code'] }],
      where: { idLocal: data.id, month: body.month },
      order: [
        ['id', 'DESC'],
      ]

    });

    if (!data2) {

      return res.send({
        ok: false,
        message: 'Este local no posee deudas en el mes ingresado'
      })
    }


    if (parseInt(body.amountUSD) > parseInt(-data2.amountUSD)) {

      return res.send({
        ok: false,
        message: 'Monto mayor a la deuda'
      })

    } else if (parseInt(body.amountUSD) == parseInt(-data2.amountUSD)) {


      data.balance = parseFloat(data.balance) + parseFloat(body.amountUSD);

      body.idLocal = data.id;
      body.idAdmin = req.usuario.id;
      body.restanteUSD = data.balance;
      body.description = `Pago referente a la deuda de ${body.month}`;
      body.nota = 0;
  
      const save = await PaymentsFunctions.create(body);
      const balanceUpdated = await LocalFunctions.updateTab({ balance: data.balance }, { where: { id: data.id } });
      const deudaDeleted = await Deudas.deleteDeuda({ where: { idLocal: data.id, month: body.month } });

  
      res.send({ save, balanceUpdated, deudaDeleted });
      
    } else {

      const deudaNueva = {
        amountUSD: parseInt(data2.amountUSD) + parseInt(body.amountUSD)
      }

      data.balance = parseFloat(data.balance) + parseFloat(body.amountUSD);

      body.idLocal = data.id;
      body.idAdmin = req.usuario.id;
      body.restanteUSD = data.balance;
      body.description = `Pago referente a la deuda de ${body.month}`;
      body.nota = 0;
  
      const save = await PaymentsFunctions.create(body);
      const balanceUpdated = await LocalFunctions.updateTab({ balance: data.balance }, { where: { id: data.id } });
      const deudaUpdated = await Deudas.updateDeuda(deudaNueva, {where: {idLocal: data.id, month: body.month}});
  
      res.send({ save, balanceUpdated, deudaUpdated });


    }



  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}

async function PagoMasDeuda(req, res) {
  try {

    const body = req.body;

    const data = await LocalFunctions.single({
      attributes: ['id', 'balance'],
      where: { code: body.code }
    });

    if (!data) {

      return res.send({
        ok: false,
        message: 'El codigo ingresado no existe'
      })
    }

    const data2 = await Deudas.single({
      attributes: ['id', 'amountUSD', 'month'],
      include: [{ model: Local, attributes: ['name', 'code'] }],
      where: { idLocal: data.id, month: body.month },
      order: [
        ['id', 'DESC'],
      ]

    });

    if (!data2) {

      return res.send({
        ok: false,
        message: 'Este local no posee deudas en el mes ingresado'
      })
    }


    console.log(body.amountUSD + ' y ademas ' + data2.amountUSD);

    if (parseInt(body.amountUSD) >= parseInt(data2.amountUSD)) {
      const deudaNueva = {
        amountUSD: parseInt(data2.amountUSD) - parseInt(body.amountUSD)
      }
      console.log('Entre en el primero');

      if ((parseInt(data2.amountUSD) - parseInt(body.amountUSD) <= 0)){
        const deudaDeleted = await Deudas.deleteDeuda({ where: { idLocal: data.id, month: body.month } });
      } else {
        const deudaUpdated = await Deudas.updateDeuda(deudaNueva, {where: {idLocal: data.id, month: body.month}});
      }

    } else {
      console.log('Entre en el segundo');
      const deudaNueva = {
        amountUSD: parseInt(data2.amountUSD) - parseInt(body.amountUSD)
      }


      const deudaUpdated = await Deudas.updateDeuda(deudaNueva, {where: {idLocal: data.id, month: body.month}});


    }



  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}

module.exports = {
  getDeudas,
  updateOrDeleteDeuda,
  getDeudasRango,
  getDeudasDesde,
  PagoMasDeuda
}



































































































































































































































