const Payments = require('../domain');
const Local = require('../../local/domain/models');
const LocalFunctions = require('../../local/domain');
const Admin = require('../../admin/domain/model');
const AdminFunctions = require('../../admin/domain');
const { Id, Schema, Pay } = require('../validations');
const { Sequelize } = require('../../database/domain');


async function getPaymentsByLocal(req, res) {    // SE REQUIEREN LOS PAGOS POR LOCAL
  try {

    let code = req.params.code;


    const data = await Payments.allPaymentsByLocal({
      attributes: ['id', 'amountUSD','idLocal', 'referenceNumber', 'restanteUSD', 'bank', 'createdAt', 'date','nota' , 'exchangeRate', 'description', 'paymentUSD', [Sequelize.literal('(exchangeRate * amountUSD)'), 'amountBS']],
      include: [{ model: Admin, attributes: ['username'] }, { model: Local, attributes: ['name', 'code'], where: { code } }],
      order: [
        ['id', 'DESC'],
      ]

    });

    /*       const admin = await Admin.all({
            attributes: ['username'],
            where: {data.idAdmin},
          }); */


    res.send(data);


  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}

async function getPaymentsDayly(req, res) {
  try {

    let day = req.query.day;
    let month = req.query.month;
    let year = req.query.year;

    Payments.allPaymentsByLocal({
      attributes: ['id', 'amountUSD', 'referenceNumber', 'restanteUSD', 'bank', 'date', 'createdAt', 'exchangeRate', 'paymentUSD', [Sequelize.literal('(exchangeRate * amountUSD)'), 'amountBS']],
      include: [{ model: Admin, attributes: ['username'] }, { model: Local, attributes: ['code'] }],
      order: [
        ['id', 'DESC'],
      ]
    }).then((resp) => {

      let pagos = [];


      for (let i = 0; i < resp.length; i++) {

        if ((resp[i].date.slice(8, 10) == day) && (resp[i].date.slice(5, 7) == month) && (resp[i].date.slice(0, 4) == year)) {

          if (resp[i].referenceNumber == null) {

            continue;

          } else {

            pagos.push(resp[i]);

          }
        }

      }

      let amountBS = [];
      let sumaBS = 0;
      let sumaUSD = 0;
      let counter = 0;
      let sumaTotal = 0;

      pagos.map(datos => {

        sumaTotal = sumaTotal + parseFloat(datos.amountUSD);

        amountBS[counter] = parseFloat(datos.amountUSD) * parseFloat(datos.exchangeRate);

        counter++;

      });

      counter = 0;

      pagos.map(datos => {

        if (datos.paymentUSD === true) {

          sumaUSD = sumaUSD + parseFloat(datos.amountUSD);

        } else {

          sumaBS = sumaBS + parseFloat(amountBS[counter]);

        }

        counter++;

      });

      res.send({
        pagos,
        totalBS: `${sumaBS} BS`,
        totalUSD: `${sumaUSD} USD`,
        sumaTotal: `${sumaTotal} USD`

      });
    })
      .catch((error) =>
        console.log(error)
      )

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}



async function getPaymentsMonthly(req, res) {
  try {

    let month = req.query.month;
    let year = req.query.year;

    Payments.allPaymentsByLocal({
      attributes: ['id', 'amountUSD', 'referenceNumber', 'restanteUSD', 'bank', 'createdAt', 'date', 'exchangeRate', 'paymentUSD', [Sequelize.literal('(exchangeRate * amountUSD)'), 'amountBS']],
      include: [{ model: Admin, attributes: ['username'] }, { model: Local, attributes: ['code'] }],
      order: [
        ['id', 'DESC'],
      ]
    }).then((resp) => {

      let pagos = [];

      for (let i = 0; i < resp.length; i++) {

        if ((resp[i].date.slice(5, 7) == month) && (resp[i].date.slice(0, 4) == year)) {

          if (resp[i].referenceNumber == null) {

            continue;

          } else {

            pagos.push(resp[i]);

          }
        }

      }

      let amountBS = [];
      let sumaBS = 0;
      let sumaUSD = 0;
      let sumaTotal = 0;
      let counter = 0;

      pagos.map(datos => {

        sumaTotal = sumaTotal + parseFloat(datos.amountUSD);

        amountBS[counter] = parseFloat(datos.amountUSD) * parseFloat(datos.exchangeRate);

        counter++;

      });

      counter = 0;

      pagos.map(datos => {

        if (datos.paymentUSD === true) {

          sumaUSD = sumaUSD + parseFloat(datos.amountUSD);

        } else {

          sumaBS = sumaBS + parseFloat(amountBS[counter]);

        }

        counter++;

      });

      res.send({
        pagos,
        totalBS: `${sumaBS} BS`,
        totalUSD: `${sumaUSD} USD`,
        sumaTotal: `${sumaTotal} USD`
      });

    })
      .catch((error) =>
        console.log(error)
      )

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}


async function getSumPaymentsUSD(req, res) {
  try {

    let month = req.query.month;
    let year = req.query.year;

    Payments.allPaymentsByLocal({
      attributes: ['amountUSD', 'referenceNumber', 'date', 'restanteUSD', 'paymentUSD', [Sequelize.literal('(exchangeRate * amountUSD)'), 'amountBS']],
      order: [
        ['id', 'DESC'],
      ]
    }).then((resp) => {

      let pagos = [];

      for (let i = 0; i < resp.length; i++) {

        if ((resp[i].date.slice(5, 7) == month) && (resp[i].date.slice(0, 4) == year)) {

          if (resp[i].referenceNumber == null) {

            continue;

          } else {

            pagos.push(resp[i]);

          }
        }
      }

      let sumaUSD = 0;

      pagos.map(datos => {
        sumaUSD = sumaUSD + parseFloat(datos.amountUSD);
      });


      res.send({
        total: `${sumaUSD}`

      });

    })
      .catch((error) =>
        console.log(error)
      )


  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}



async function make(req, res) {
  try {

    const body = await Pay.validateAsync(req.body);

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

    data.balance = parseFloat(data.balance) - parseFloat(body.amountUSD) - parseFloat(body.nota);

    body.idLocal = data.id;
    body.idAdmin = req.usuario.id;
    body.restanteUSD = data.balance;

    const save = await Payments.create(body);
    const balanceUpdated = await LocalFunctions.updateTab({ balance: data.balance }, { where: { id: data.id } });

    res.send({ save, balanceUpdated });


  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}

async function updatePayment(req, res) {
  try {

    const reference = req.params.reference;

    const body = await Pay.validateAsync(req.body);

    body.idAdmin = req.usuario.id;

    const data = await Payments.updatePay(body, { where: { referenceNumber: reference } });

    res.send(data);


  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}

async function deletePayment(req, res) {
  try {

    const id = req.params.id;
    console.log(id);
    await Payments.deletePay({ where: { id: id } });

    res.send({
      ok: true,
      res: `${id} ha sido eliminado`
    });


  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}


async function updateCode(req, res) {

  try {

    const code = req.body.code;
    const id = req.body.id;
    const amount = req.body.amount;

    let data2 = await LocalFunctions.single({
      where: { code }
    });

    if (!data2 || data2.length == 0) {
      return res.send({
        ok: false,
        message: 'El codigo ingresado no existe'
      })
    }

    let data3 = await LocalFunctions.single({
      where: { code: 0000 }
    });

    const oldBalance = {
      balance: parseFloat(data3.balance) + parseFloat(amount)
    }

    const payment = {
      idLocal: data2.id,
      restanteUSD: parseFloat(data2.balance) - parseFloat(amount),
    }

    const balance = {
      balance: parseFloat(data2.balance) - parseFloat(amount)
    }


    const paymentUpdated = await Payments.updatePay(payment, { where: { id } });
    const balanceUpdated = await LocalFunctions.updateTab(balance, { where: { code } });
    const oldBalanceUpdated = await LocalFunctions.updateTab(oldBalance, { where: { code: 0000 } });


    res.send({ paymentUpdated, balanceUpdated, oldBalanceUpdated });


  } catch (e) {
    res.status(400).send({ error: e.message })
  }

}


module.exports = {
  make,
  getPaymentsByLocal,
  updatePayment,
  deletePayment,
  getPaymentsDayly,
  getPaymentsMonthly,
  getSumPaymentsUSD,
  updateCode,
  deletePayment
}
