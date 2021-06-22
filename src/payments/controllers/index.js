const Payments = require('../domain');
const Local = require('../../local/domain/models');
const Exchange = require('../../exchangeRate/domain/model');
const LocalFunctions = require('../../local/domain');
const { Id, Schema, Pay } = require('../validations');
const { Sequelize } = require('../../database/domain');


async function getPaymentsByLocal(req, res){    // SE REQUIEREN LOS PAGOS POR LOCAL
  try {

    let code = req.params.code;


      const data = await Payments.allPaymentsByLocal({
        attributes: ['amountUSD', 'referenceNumber', 'bank', 'date', [Sequelize.literal('(price * amountUSD)'), 'AmountBs'], 'idLocal'],
        include: [{ model: Exchange, attributes: ['price'] },{ model: Local, attributes: ['name', 'code'],where:{code} } ],

        });
        console.log(code);
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
