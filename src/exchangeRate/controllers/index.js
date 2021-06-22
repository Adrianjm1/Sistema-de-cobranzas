const Exchange = require('../domain')
const { Id, Schema, Fecha } = require('../validations');
const { Sequelize, Op  } = require('sequelize');

async function getAll(req, res){
  try {
    const data = await Exchange.all();
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}


async function getAllByDay(req, res){
  try {


    // function restarDia(date, horas){
    //   date.setDate(date.getDate() - horas);
    //   return date;
    // }


    const dateAux = req.params.date;
    const dateParse = Date.parse(dateAux);
    const date = new Date (dateParse);
   // const datex = restarDia(date, 1);
    
                                                                              //const date = await Fecha.validateAsync(fecha);
                                                                              //const date = Fecha.validateAsync({req.params});

                                                                              //const fecha = req.params.date.split('-');
                                                                              //const date = new Date(fecha[0],fecha[1],[fecha[2]])


    const data = await Exchange.all({
      
      attributes: ['price', 'createdAt'],
      where: {createdAt:  {   [Op.gte]: date,      } }
      
    });

    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

async function getOne(req, res){
  try {
    const { id } = await Id.validateAsync(req.params);
    const data = await Exchange.single({
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
    const data = await Exchange.create(body);
    res.send(data)
  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

module.exports = {
  getAll,
  getOne,
  make,
  getAllByDay
}
