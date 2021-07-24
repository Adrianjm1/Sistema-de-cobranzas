const Lagomalldata = require('../domain')
const { Id, Schema, BreakE } = require('../validations')
const { Sequelize } = require('sequelize');


async function getAll(req, res) {
  try {
    const data = await Lagomalldata.all({ attributes: ['month', 'breakeven', 'meter', [Sequelize.literal('meter*breakeven'), 'montoDeCondominio']] });
    res.send(data)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}


async function getLast(req, res) {
  try {
    const data = await Lagomalldata.all({
      attributes: ['id','month', 'breakeven','discount', 'meter', [Sequelize.literal('meter*breakeven'), 'montoDeCondominio']],
      order: [
        ['id', 'DESC'],
      ],
      limit : 1,
    });
    res.send(data)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}


async function updateBreakeven(req, res) {

  const { id } = await Id.validateAsync(req.params);
  const { breakeven } = await BreakE.validateAsync(req.body);


  try {
    const data = await Lagomalldata.updateBE({ breakeven: req.body.breakeven }, { where: { id: id } });
    res.send(data)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}

async function createNewMonth(req, res) {
  try {
    const body = await BreakE.validateAsync(req.body);

    let monthx = body.month

    let monthx2= monthx + '-02'

    const data = await Lagomalldata.make({
      breakeven: body.breakeven,
      meter: 18030,
      month: body.month,
      discount: body.discount
    });

    res.send(data);

  } catch (e) {
    res.status(400).send({ error: e.message })
    console.log(e);
  }
}


// updatedData =  Local.updateTab( {prontoPago: data[i].prontoPago}, {where: {code: data[i].code}});    


module.exports = {
  getAll,
  updateBreakeven,
  createNewMonth,
  getLast,
}
