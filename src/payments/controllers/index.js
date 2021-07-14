const Payments = require('../domain');
const Local = require('../../local/domain/models');
const LocalFunctions = require('../../local/domain');
const Admin = require('../../admin/domain/model');
const AdminFunctions = require('../../admin/domain');
const { Id, Schema, Pay } = require('../validations');
const { Sequelize } = require('../../database/domain');


async function getPaymentsByLocal(req, res){    // SE REQUIEREN LOS PAGOS POR LOCAL
  try {

    let code = req.params.code;


      const data = await Payments.allPaymentsByLocal({
        attributes: ['id','amountUSD', 'referenceNumber', 'bank', 'createdAt', 'exchangeRate', 'paymentUSD', [Sequelize.literal('(exchangeRate * amountUSD)'), 'amountBS']],
        include: [{model: Admin, attributes: ['username']},{ model: Local, attributes: ['name', 'code'], where:{code}}],
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
    res.status(400).send({error: e.message})
  }
}

async function getPaymentsByMonth(req, res){  
  try {

      let month = req.params.mes;

      const data = await Payments.allPaymentsByLocal({
        attributes: ['id','amountUSD', 'referenceNumber', 'bank', 'createdAt', 'exchangeRate', 'paymentUSD', [Sequelize.literal('(exchangeRate * amountUSD)'), 'amountBS']],
        include: [{model: Admin, attributes: ['username']},{ model: Local, attributes: ['code']}],
        order: [
          ['id', 'DESC'],
        ]      
      });

      let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      let contador = 1;

      const year = month.slice(3,7);
      month = month.slice(0,2);

      months.map(item => {
        if(parseInt(month) == contador){
          month = item;
        }
        contador++;
      });

      let pagos = [];

      data.map(item => {

        if(item.createdAt.toString().slice(4,7) === month && item.createdAt.toString().slice(11,15) === year){
          
          pagos.push(item);

        }

      });

      res.send(pagos);



  } catch (e) {
    res.status(400).send({error: e.message})
  }
}




async function getAllPayments(req, res){   
  try {

      const data = await Payments.getSumPayments({
        attributes: ['amountUSD', 'exchangeRate', 'paymentUSD']
      });

      let counter = 0;

      let amountBS = [];
      let sumaBS = 0;
      let sumaUSD = 0;

      data.map(datos => {

        amountBS[counter] = parseFloat(datos.amountUSD) * parseFloat(datos.exchangeRate);

        counter++;
        
      });

      counter = 0;

      data.map(datos => {

        if(datos.paymentUSD === true){

          sumaUSD = sumaUSD + parseFloat(datos.amountUSD);

        }else{

          sumaBS = sumaBS + parseFloat(amountBS[counter]);

        }

        counter++;

      });

      res.send({
        totalBS: `${sumaBS} BS`,
        totalUSD: `${sumaUSD} USD`

      });



  } catch (e) {
    res.status(400).send({error: e.message})
  }
}


async function make(req, res){
  try {

    const body = await Pay.validateAsync(req.body);
    
    const data = await LocalFunctions.single({
      attributes: ['id', 'balance'],
      where: {code: body.code}
    });

    if(!data){
      return res.send({
        ok: false,
        message: 'El codigo ingresado no existe'
      })
    }

    data.balance = parseFloat(data.balance) + parseFloat(body.amountUSD);

    body.idLocal = data.id;
    body.idAdmin = req.usuario.id;
     
    const save = await Payments.create(body);
    const balanceUpdated = await LocalFunctions.updateTab({balance: data.balance},{where: {id: data.id}});

    res.send({save,balanceUpdated});


  } catch (e) {
    console.log(e);
    res.status(400).send({error: e.message})
  }
}

async function updatePayment(req, res){
  try {

    const reference = req.params.reference;

    const body = await Pay.validateAsync(req.body);

    body.idAdmin = req.usuario.id;

    const data = await Payments.updatePay(body,{where: {referenceNumber: reference}});

    res.send(data);


  } catch (e) {
    res.status(400).send({error: e.message})
  }
}

async function deletePayment(req, res){
  try {

    const reference = req.params.reference;

    await Payments.deletePay({where: {referenceNumber: reference}});

    res.send({
      ok: true,
      res: `${reference} ha sido eliminado`
    });


  } catch (e) {
    res.status(400).send({error: e.message})
  }
}


module.exports = {
  make,
  getPaymentsByLocal,
  updatePayment,
  deletePayment,
  getAllPayments,
  getPaymentsByMonth
}
