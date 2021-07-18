const Router = require('express').Router();
const Controller = require('./index.js');
const {validToken, verificaAdminMaster} = require('../../admin/controllers/middleware');

Router.get('/', validToken, Controller.getAll);
Router.get('/last', validToken, Controller.getLast);
Router.patch('/:id', [validToken,verificaAdminMaster], Controller.updateBreakeven)
Router.post('/make', [validToken,verificaAdminMaster], Controller.createNewMonth)


module.exports = Router
