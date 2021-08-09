const Local = require('../../local/domain/models');
const LocalFunctions = require('../../local/domain');
const Deudas = require('../domain');
const { Sequelize } = require('../../database/domain');


async function getDeudas(req, res) {    // SE REQUIEREN LOS PAGOS POR LOCAL
  try {

    const month = req.query.month;

    const data = await Deudas.all({
      attributes: ['id', 'amountUSD', 'month'],
      include: [{ model: Local, attributes: ['name', 'code']}],
      where: { month: month },
      order: [
        ['id', 'DESC'],
      ]

    });

    res.send(data);

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}

module.exports = {
  getDeudas
}
