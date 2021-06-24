const Router = require('express').Router();
const Controller = require('./index.js');
const {validToken} = require('../../admin/controllers/middleware')

Router.get('/table', validToken, Controller.getTableMonthly);
Router.post('/make', validToken, Controller.make);
Router.patch('/up', validToken, Controller.updateTable);

/* Router.get('/:id', validToken, Controller.getAll);
 */
/* Router.get('/', validToken, Controller.getTableMonthly);
 */


module.exports = Router
