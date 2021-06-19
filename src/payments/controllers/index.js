const Payments = require('../domain');
const Local = require('../../local/domain/models');
const LocalFunctions = require('../../local/domain');
const Exchange = require('../../exchangeRate/domain');
const { Id, Schema, Pay } = require('../validations');


async function getPaymentsByLocal(req, res){    // SE REQUIEREN LOS PAGOS POR LOCAL
  try {

    let idLocal = req.params.id;

      const data = await Payments.allPaymentsByLocal({
        attributes: ['amountUSD', 'referenceNumber', 'bank', 'date', 'idLocal'],
        include: [{ model: Local, attributes: ['name', 'code'] }],
        where: {idLocal}});

    res.send(data)


  } catch (e) {
    res.status(400).send({error: e.message})
  }
}



async function make(req, res){
  try {

    const body = await Pay.validateAsync(req.body);

    const data = await LocalFunctions.single({
      attributes: ['id'],
      where: {code: body.code}
    });

    if(!data){
      return res.send({
        message: 'El codigo ingresado no existe'
      })
    }

    body.idLocal = data.id;
    body.idExchangeRate = 1;

    const save = await Payments.create(body);

    res.send(save);


  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

module.exports = {
  make,
  getPaymentsByLocal
}
