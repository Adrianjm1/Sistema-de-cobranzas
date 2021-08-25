const { Op, sequelize } = require('sequelize');
const pdf = require('html-pdf');
const Local = require('../../local/domain/index');
const PaymentsFunctions = require('../../payments/domain/index');
const DeudasFunctions = require('../../deudas/domain/index');
const AdminModel = require('../../admin/domain/model');
const LocalModel = require('../../local/domain/models');
const Owner = require('../../owner/domain/model');
const { formatNumber } = require('../helpers/helpers');
const deudasFunctions = require('../../deudas/domain/index');
const LagoMallData = require('../../lagomalldata/domain/models');
const LMDFunctions = require('../../lagomalldata/domain/index');
const { Sequelize } = require('../../database/domain');

async function getTablePDF(req, res) {
  try {

    let month = req.query.month;
    let year = req.query.year;

    const data = PaymentsFunctions.allPaymentsByLocal({
      attributes: ['amountUSD', 'paymentUSD', 'referenceNumber'],
      order: [
        ['id', 'DESC'],
      ]
    })

    let pagos = [];

    for (let i = 0; i < data.length; i++) {

      if ((data[i].date.slice(5, 7) == month) && (data[i].date.slice(0, 4) == year)) {

        if (data[i].referenceNumber == null) {

          continue;

        } else {

          pagos.push(data[i]);

        }
      }
    }

    let sumaPagosUSD = 0;

    pagos.map(datos => {
      sumaPagosUSD = sumaPagosUSD + parseFloat(datos.amountUSD);
    });


    const data2 = await Local.all({
      attributes: ['monthlyUSD', 'balance', 'prontoPago', 'code', 'balance', 'percentageOfCC'],
      include: [{ model: Owner, attributes: ['firstName', 'lastName'] }]
    });

    let sumaUSD = 0;
    let sumaPronto = 0;

    data2.map(datos => {

      sumaUSD = sumaUSD + parseFloat(datos.monthlyUSD);
      sumaPronto = sumaPronto + parseFloat(datos.prontoPago);

    });

    const date = new Date(Date.now());

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
                      text-align: center;
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
            
            <h2>CONDOMINIO CENTRO LAGO MALL</h2>

            <p>Emitido el ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</p>

            <br>

            <p> Monto total: &nbsp;&nbsp;&nbsp; ${sumaUSD}$</p>
            <p> Monto total pagado: &nbsp;&nbsp;&nbsp; ${sumaPagosUSD}$</p>
            <p> Monto restante por pagar: &nbsp;&nbsp;&nbsp; ${sumaUSD - sumaPagosUSD}$</p>
            <p> Monto total pronto pago: &nbsp;&nbsp;&nbsp; ${sumaPronto}$</p>
            <p> Porcentaje del monto total pagado: &nbsp;&nbsp;&nbsp; ${((sumaPagosUSD * 100) / sumaUSD)}%</p>


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

    data2.map(datos => (

      part2 = part2 + `
          <tr>
              <td>${datos.code}</td>
              <td>${datos.owner.firstName} ${datos.owner.lastName}</td>
              <td>${datos.percentageOfCC}</td>
              <td>${datos.monthlyUSD}</td>
              <td>${datos.prontoPago}</td>
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


    /*     pdf.create(content).toStream(function(err, stream){
          if(err) {
            res.send(err);
          }else{
            console.log('amigo de los gallos y de las gallinas');
                  res.set('Content-type', 'application/pdf');
                  res.set('Content-Disposition', 'attachment;filename=template.pdf')
                  res.set('Cache-Control', 'no-cache')
                  stream.pipe(res)
    
          }
        }); */



  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}





async function pagosPorDiaPDF(req, res) {
  try {

    let day = req.query.day;
    let month = req.query.month;
    let year = req.query.year;

    const date = new Date(Date.now());

    meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    PaymentsFunctions.allPaymentsByLocal({
      attributes: ['id', 'amountUSD', 'referenceNumber', 'restanteUSD', 'bank', 'date', 'createdAt', 'exchangeRate', 'paymentUSD', [Sequelize.literal('(exchangeRate * amountUSD)'), 'amountBS']],
      include: [{ model: AdminModel, attributes: ['username'] }, { model: LocalModel, attributes: ['code'] }],
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
                      text-align: center;
                    }

                    table {
                      table-layout: fixed;
                      width: 100%;
                      border-collapse: collapse;
                      border: 2px solid #19437F;
                    }

                    th {
                      letter-spacing: 2px;
                      font-size: 75%;
                    }
                    
                    td {
                      letter-spacing: 1px;
                      font-size: 75%;
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
            
            <h2>CONDOMINIO CENTRO LAGO MALL</h2>

            <p>Emitido el ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</p>

            <h3>Pagos del <b>${day}</b> de <b>${meses[parseInt(month) - 1]}</b> del año <b>${year}</b></h3>

            <br>

            <table>
            <thead>

                <tr>
                    <th>Facturado en dolares ($)</th>
                    <th>Facturado en boívares (Bs.S)</th>
                    <th>Total ($)</th>
                </tr>
            </thead>
            
            <tbody>

            <td>${sumaUSD}</td>
            <td>${formatNumber(sumaBS)}</td>
            <td>${sumaTotal}</td>

            </tbody>

            </table>

            <br>
            <br>

            <table>
            <thead>

                <tr>
                    <th>Codigo</th>
                    <th>Monto($)</th>
                    <th>Monto (Bs)</th>
                    <th>Referencia</th>
                    <th>Banco</th>
                    <th>Tasa de cambio</th>
                    <th>Pago en $</th>
                    <th>Por pagar</th>
                    <th>Registrado por</th>
                </tr>
            </thead>
            
            <tbody>
            `

      let part2 = '';

      pagos.map(data => (

        part2 = part2 + `
          <tr>
          <td>${data.locale.code}</td>
          <td>${formatNumber(parseFloat(data.amountUSD))}</td>
          <td>${formatNumber((parseFloat(data.amountUSD) * parseFloat(data.exchangeRate)).toFixed(2))}</td>
          <td>${data.referenceNumber}</td>
          <td>${data.bank}</td>
          <td>${formatNumber(parseFloat(data.exchangeRate).toFixed(2))}</td>
          <td>${data.paymentUSD === false ? 'No' : 'Si'}</td>
          <td>${formatNumber(parseFloat(data.restanteUSD))}</td>
          <td>${data.admin.username}</td>

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


      /*     pdf.create(content).toStream(function(err, stream){
            if(err) {
              res.send(err);
            }else{
              console.log('amigo de los gallos y de las gallinas');
                    res.set('Content-type', 'application/pdf');
                    res.set('Content-Disposition', 'attachment;filename=template.pdf')
                    res.set('Cache-Control', 'no-cache')
                    stream.pipe(res)
      
            }
          }); */


    });

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}

async function pagosPorMesPDF(req, res) {
  try {

    let month = req.query.month;
    let year = req.query.year;

    const date = new Date(Date.now());

    meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    PaymentsFunctions.allPaymentsByLocal({
      attributes: ['id', 'amountUSD', 'referenceNumber', 'restanteUSD', 'bank', 'date', 'createdAt', 'exchangeRate', 'paymentUSD', [Sequelize.literal('(exchangeRate * amountUSD)'), 'amountBS']],
      include: [{ model: AdminModel, attributes: ['username'] }, { model: LocalModel, attributes: ['code'] }],
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
                      text-align: center;
                    }

                    table {
                      table-layout: fixed;
                      width: 100%;
                      border-collapse: collapse;
                      border: 2px solid #19437F;
                    }

                    th {
                      letter-spacing: 2px;
                      font-size: 75%;
                    }
                    
                    td {
                      letter-spacing: 1px;
                      font-size: 75%;
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
            
            <h2>CONDOMINIO CENTRO LAGO MALL</h2>

            <p>Emitido el ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</p>

            <h3>Pagos del mes ${meses[parseInt(month) - 1]} del año ${year}</h3>

            <br>

            <table>
            <thead>

                <tr>
                    <th>Facturado en dolares ($)</th>
                    <th>Facturado en boívares (Bs.S)</th>
                    <th>Total ($)</th>
                </tr>
            </thead>
            
            <tbody>

            <td>${sumaUSD}</td>
            <td>${formatNumber(sumaBS)}</td>
            <td>${sumaTotal}</td>

            </tbody>

            </table>

            <br>
            <br>

            <table>
            <thead>

                <tr>
                    <th>Codigo</th>
                    <th>Fecha</th>
                    <th>Monto($)</th>
                    <th>Monto (Bs)</th>
                    <th>Referencia</th>
                    <th>Banco</th>
                    <th>Tasa de cambio</th>
                    <th>Pago en $</th>
                    <th>Por pagar</th>
                    <th>Registrado por</th>
                </tr>
            </thead>
            
            <tbody>
            `

      let part2 = '';

      pagos.map(data => (

        part2 = part2 + `
          <tr>
          <td>${data.locale.code}</td>
          <td>${data.date}</td>
          <td>${formatNumber(parseFloat(data.amountUSD))}</td>
          <td>${formatNumber((parseFloat(data.amountUSD) * parseFloat(data.exchangeRate)).toFixed(2))}</td>
          <td>${data.referenceNumber}</td>
          <td>${data.bank}</td>
          <td>${formatNumber(parseFloat(data.exchangeRate).toFixed(2))}</td>
          <td>${data.paymentUSD === false ? 'No' : 'Si'}</td>
          <td>${formatNumber(parseFloat(data.restanteUSD))}</td>
          <td>${data.admin.username}</td>

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


      /*     pdf.create(content).toStream(function(err, stream){
            if(err) {
              res.send(err);
            }else{
              console.log('amigo de los gallos y de las gallinas');
                    res.set('Content-type', 'application/pdf');
                    res.set('Content-Disposition', 'attachment;filename=template.pdf')
                    res.set('Cache-Control', 'no-cache')
                    stream.pipe(res)
      
            }
          }); */


    });

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}

async function deudasPorMesPDF(req, res) {
  try {

    const month = req.query.month;

    meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const date = new Date(Date.now());

    const data = await DeudasFunctions.all({
      attributes: ['id', 'amountUSD', 'month'],
      include: [{ model: LocalModel, attributes: ['name', 'code'] }],
      where: { month: month },
      order: [
        ['id', 'ASC'],
      ]

    });

    let sumDeudas = 0;

    for (let i = 0; i < data.length; i++) {

      sumDeudas = sumDeudas + (parseFloat(data[i].amountUSD) * -1);

    }

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
                      text-align: center;
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
            
            <h2>CONDOMINIO CENTRO LAGO MALL</h2>

            <p>Emitido el ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</p>

            <h3>Deudas del mes de ${meses[parseInt(month.slice(0, 2)) - 1]} del año ${month.slice(3, 7)}</h3>
                      
            <p> Total en deudas del mes: &nbsp;&nbsp;&nbsp; ${sumDeudas}$</p>

            <br>

            <table>
            <thead>

                <tr>
                    <th>Codigo</th>
                    <th>Nombre</th>
                    <th>Mes</th>
                    <th>Deuda ($)</th>
                </tr>
            </thead>
            
            <tbody>
            `

    let part2 = '';

    data.map(data => (

      part2 = part2 + `
        <td>${data.locale.code}</td>
        <td>${data.locale.name}</td>
        <td>${`${meses[parseInt(data.month.slice(0, 2)) - 1]} ${data.month.slice(3, 7)}`}</td>
        <td>${formatNumber(parseFloat(data.amountUSD))}</td>

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


    /*     pdf.create(content).toStream(function(err, stream){
          if(err) {
            res.send(err);
          }else{
            console.log('amigo de los gallos y de las gallinas');
                  res.set('Content-type', 'application/pdf');
                  res.set('Content-Disposition', 'attachment;filename=template.pdf')
                  res.set('Cache-Control', 'no-cache')
                  stream.pipe(res)
    
          }
        }); */

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}

async function deudasPorRangoPDF(req, res) {
  try {

    const month1 = req.query.month1;
    const month2 = req.query.month2;

    meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const date = new Date(Date.now());

    const data = await DeudasFunctions.all({
      attributes: ['id', 'month', 'amountUSD', [Sequelize.fn('sum', Sequelize.col('amountUSD')), 'deudaTotal']],
      include: [{ model: LocalModel, attributes: ['name', 'code'] }],
      where: { month: { [Op.between]: [month1, month2] } },
      raw: true,
      order: [
        ['id', 'ASC'],
      ],
      group: ['code']

    });

    const data2 = await DeudasFunctions.all({
      attributes: ['id', 'month', [Sequelize.fn('sum', Sequelize.col('amountUSD')), 'deudaTotal']],
      include: [{ model: LocalModel, attributes: ['name', 'code'] }],
      where: { month: { [Op.between]: [month1, month2] } },
      order: [
        ['id', 'ASC'],
      ],
      group: ['code']

    });

    let sumDeudas = 0;

    for (let i = 0; i < data.length; i++) {

      sumDeudas = sumDeudas + (parseFloat(data[i].deudaTotal) * -1);

    }

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
                      text-align: center;
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
            
            <h2>CONDOMINIO CENTRO LAGO MALL</h2>

            <p>Emitido el ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</p>

            <h3>Deudas entre los meses de ${meses[parseInt(month1.slice(0, 2)) - 1]} ${month1.slice(3, 7)} y ${meses[parseInt(month2.slice(0, 2)) - 1]} ${month2.slice(3, 7)}</h3>
                      
            <p> Total en deudas en el rango establecido: &nbsp;&nbsp;&nbsp; ${sumDeudas}$</p>

            <br>

            <table>
            <thead>

                <tr>
                    <th>Codigo</th>
                    <th>Nombre</th>
                    <th>Deuda ($)</th>
                </tr>
            </thead>
            
            <tbody>
            `

    let part2 = '';


    for (let i = 0; i < data.length; i++) {

      part2 = part2 + `
        <td>${data2[i].locale.code}</td>
        <td>${data2[i].locale.name}</td>
        <td>${formatNumber(parseFloat(data[i].deudaTotal))}</td>        

          </tr>`

    }




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


    /*     pdf.create(content).toStream(function(err, stream){
          if(err) {
            res.send(err);
          }else{
            console.log('amigo de los gallos y de las gallinas');
                  res.set('Content-type', 'application/pdf');
                  res.set('Content-Disposition', 'attachment;filename=template.pdf')
                  res.set('Cache-Control', 'no-cache')
                  stream.pipe(res)
    
          }
        }); */

  } catch (e) {
    res.status(400).send({ error: e.message })
  }
}



module.exports = {
  getTablePDF,
  pagosPorDiaPDF,
  pagosPorMesPDF,
  deudasPorMesPDF,
  deudasPorRangoPDF

}
