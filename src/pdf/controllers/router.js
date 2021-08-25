const Router = require('express').Router();
const Controller = require('./index.js');
const {validToken} = require('../../admin/controllers/middleware');

Router.get('/table', validToken, Controller.getTablePDF);
Router.get('/pagos/dia', validToken, Controller.pagosPorDiaPDF);
Router.get('/pagos/mes', validToken, Controller.pagosPorMesPDF);
Router.get('/deudas/mes', validToken, Controller.deudasPorMesPDF);
Router.get('/deudas/rango', validToken, Controller.deudasPorRangoPDF);



module.exports = Router;
