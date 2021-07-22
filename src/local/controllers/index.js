const { Op, sequelize } = require('sequelize');
const pdf = require('html-pdf');
const Local = require('../domain/index');
const Payments = require('../../payments/domain/index');
const Owner = require('../../owner/domain/model');
const { Id, Schema, Month, Pronto } = require('../validations');
const LagoMallData = require('../../lagomalldata/domain/models');
const LMDFunctions = require('../../lagomalldata/domain/index');
const { Sequelize } = require('../../database/domain');

async function getTable(req, res) {
  try {
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

async function getTablePDF(req, res) {
  try {

    const data = await Local.all({
      attributes: ['name', 'code', 'percentageOfCC', 'monthlyUSD', 'balance', 'prontoPago'],
      include: [{ model: Owner, attributes: ['firstName', 'lastName'] }]
    });

    let sumaUSD = 0;
    let sumaPronto = 0;

    data.map(datos => {

      sumaUSD = sumaUSD + parseFloat(datos.monthlyUSD);
      sumaPronto = sumaPronto + parseFloat(datos.prontoPago);

    });

    const date = new Date(Date.now());

    const payments = await Payments.allPaymentsByLocal({
      attributes: ['amountUSD', 'createdAt', 'paymentUSD', [Sequelize.literal('(exchangeRate * amountUSD)'), 'amountBS']],
      order: [
        ['id', 'DESC'],
      ]
    })

    let pagos = [];

    for (let i = 0; i < payments.length; i++) {

      if (((payments[i].createdAt.getMonth() + 1) == (date.getMonth() + 1)) && (payments[i].createdAt.getFullYear() == date.getFullYear())) {

        pagos.push(payments[i]);

      }

    }

    let pagosUSD = 0;

    pagos.map(datos => {

      pagosUSD = pagosUSD + parseFloat(datos.amountUSD);

    });

    let part1 = `
    <!doctype html>
        <html>
           <head>
                <meta charset="utf-8">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&family=Roboto:wght@300&display=swap" rel="stylesheet">
                <title>PDF Result Template</title>
                <style>

                    *{
                      font-family: 'Roboto', sans-serif;
                      font-size: 95%;
                    }

                    h2{
                      color: #19437F;
                      font-size: 160% !important;
                    }

                    table {
                      table-layout: fixed;
                      width: 100%;
                      border-collapse: collapse;
                      border: 2px solid #19437F;
                    }

                    th {
                      letter-spacing: 2px;
                    }
                    
                    td {
                      letter-spacing: 1px;
                    }
                    
                    tbody td {
                      text-align: center;
                      padding: 7px 0px 7px 0px;
                    }
                    
                    tfoot th {
                      text-align: right;
                    }

                    thead th, tfoot th {
                      background-color: #19437F;
                      color: #fff;
                    }                    


                </style>
            </head>
            <body>
            
            <h2>Centro de cobranzas Lago Mall</h2>
            <p>Emitido el ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</p>

            <br>

            <p> Monto total: &nbsp;&nbsp;&nbsp;&nbsp; ${sumaUSD}</p>
            <p> Monto total pronto pago: &nbsp;&nbsp;&nbsp;&nbsp; ${sumaPronto}</p>
            <p> Porcentaje del monto total pagado: &nbsp;&nbsp;&nbsp;&nbsp; ${((pagosUSD * 100) / sumaUSD)}%</p>


            <br>

            <table>
            <thead>

                <tr>
                    <th>Locales</th>
                    <th>Propietarios</th>
                    <th>% Según documento de condominio</th>
                    <th>Cuota total en $</th>
                    <th>Pronto Pago</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            
            <tbody>
            `

    let part2 = '';

    data.map(datos => (

      part2 = part2 + `
          <tr>
              <td>${datos.code}</td>
              <td>${datos.owner.firstName} ${datos.owner.lastName}</td>
              <td>${datos.percentageOfCC}</td>
              <td>${datos.monthlyUSD}</td>
              <td>${datos.balance}</td>
              <td>${datos.balance}</td>

          </tr>`

    ));

    let part3 = `
      </tbody>

      </table>

        </body>
      </html>`;

    let content = part1 + part2 + part3;




    pdf.create(content).toFile('./docs/html-pdf.pdf', function (err, resp) {
      if (err) {
        res.send(err);
      } else {
        res.send(resp);
      }

    });

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}

// async function deudaTotal(req,res){

//   try {
//     const data = await Local.all({
//       attributes: 
//       ['monthlyUSD', 'prontoPago', 
//       [Sequelize.fn('sum', Sequelize.col('monthlyUSD')), 'total'],
//       [Sequelize.fn('sum', Sequelize.col('prontoPago')), 'totalPronto']]  

//     });
//     res.send(data)
//   } catch (e) {
//     res.status(400).send({ error: e.message })
//   }

// }



async function getTableMonthly(req, res) {

  let date = req.params.mes + '-01';

  let dateMax = req.params.mes + '-30';

  // let date = req.body.month + '-01';

  // let dateMax = req.body.month + '-30';

  console.log(date);
  try {

    const data = await Local.all({
      attributes: ['name', 'code', 'percentageOfCC', 'monthlyUSD', 'prontoPago'],
      include: [{ model: Owner, attributes: ['firstName', 'lastName'] }],
    });


    const LGdata = await LagoMallData.findOne({ where: { month: { [Op.between]: [date, dateMax] } } });

    let condominio = (LGdata.breakeven * LGdata.meter);  // MONTO DEL CONDOMINIO
    let discount = LGdata.discount;

    data.map(datos => {
      datos.monthlyUSD = (datos.percentageOfCC * condominio).toFixed(2);  //CALCULO DE CUOTA MENSUAL
      datos.monthlyUSD = Math.round(datos.monthlyUSD);               //REDONDEAR LOS DATOS ANTES DE REALIZAR la consulta
      datos.prontoPago = (datos.monthlyUSD - (datos.monthlyUSD * (discount / 100))).toFixed(2);
      datos.prontoPago = Math.round(datos.prontoPago);
      // deudaTotalProntoPago += datos.prontoPago;
      // deudaTotal += datos.monthlyUSD


    });

    res.send(data)

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}


async function updateBalance(req, res) {

  try {

    const code = req.params.code;
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

    let dateMax = req.body.month + '-30';

    // DIA DEL MES PARA DIFERENCIAR ENTRE COBRAR PRONTO PAGO Y MONTO COMPLETP (A DISCUSION)
    let body = await Pronto.validateAsync(req.body);

    let updatedData = [];
    let dayAux = new Date();
    let day = dayAux.getDate();

    console.log(day);

    const data = await Local.all({
      attributes: ['name', 'monthlyUSD', 'code', 'prontoPago', 'percentageOfCC', 'balance'],


    });

    const LGdata = await LagoMallData.findOne({ where: { month: { [Op.between]: [date, dateMax] } } });

    if (!data || !LGdata) {

      return res.send({
        ok: false,
        resp: 'Fecha invalida'      //Se colocan los parentesis de muestra, pero se deben quitar
      })

    } else {


      let condominio = (LGdata.breakeven * LGdata.meter);  // MONTO DEL CONDOMINIO
      let discount = LGdata.discount;



      data.map(datos => {
        datos.monthlyUSD = (datos.percentageOfCC * condominio).toFixed(2);  //CALCULO DE CUOTA MENSUAL
        datos.monthlyUSD = Math.round(datos.monthlyUSD);               //REDONDEAR LOS DATOS ANTES DE REALIZAR EL UPDATE
        datos.prontoPago = (datos.monthlyUSD - (datos.monthlyUSD * (discount / 100))).toFixed(2);
        datos.prontoPago = Math.round(datos.prontoPago);


        if (day < body.diaProntoPago) {          //SI EL DIA ES MENOR AL ESTABLECIDO, ENTONCES COBRAR PRONTOPAGO, SINO, MONTO COMPLETO

          datos.balance = datos.balance - datos.prontoPago;

          for (let i = 0; i < data.length; i++) {
            updatedData = Local.updateTab({ monthlyUSD: data[i].monthlyUSD, idLGData: LGdata.id }, { where: { code: data[i].code } });
            updatedData = Local.updateTab({ prontoPago: data[i].prontoPago, balance: data[i].balance }, { where: { code: data[i].code } });
          }

        } else {

          datos.balance = datos.balance - datos.monthlyUSD

          for (let i = 0; i < data.length; i++) {
            updatedData = Local.updateTab({ monthlyUSD: data[i].monthlyUSD, balance: data[i].balance }, { where: { code: data[i].code } });
            updatedData = Local.updateTab({ prontoPago: data[i].prontoPago }, { where: { code: data[i].code } });
          }

        }


      });

      res.send(data);

    }


  } catch (e) {
    res.status(400).send({ error: e.message })
  }

}






async function getOne(req, res) {
  try {
    const { id } = await Id.validateAsync(req.params);
    const data = await Local.single({
      where: { id: id }
    });
    res.send(data)
  } catch (e) {
    res.status(400).send({ error: e.message })
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

module.exports = {
  getTable,
  getOne,
  make,
  getTableMonthly,
  updateTable,
  updateBalance,
  getTablePDF

}
