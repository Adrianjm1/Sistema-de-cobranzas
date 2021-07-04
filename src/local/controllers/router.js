const Router = require('express').Router();
const Controller = require('./index.js');
const {validToken, verificaAdminMaster} = require('../../admin/controllers/middleware')

Router.get('/tableMonthly', validToken, Controller.getTableMonthly);
Router.get('/table'  /*, validToken*/, Controller.getTable);
Router.post('/make', validToken, Controller.make);
Router.put('/up/:code', [validToken, verificaAdminMaster], Controller.updateBalance);
Router.patch('/up', [validToken, verificaAdminMaster], Controller.updateTable);

/* Router.get('/:id', validToken, Controller.getAll);
 */
/* Router.get('/', validToken, Controller.getTableMonthly);
 */


module.exports = Router
