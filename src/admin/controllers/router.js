const Router = require('express').Router();
const Controller = require('./index.js');

Router.get('/', Controller.getAll);
Router.post('/login', Controller.login);
Router.get('/make', Controller.make);
/* Router.get('/:id', Controller.getOne);
 */
module.exports = Router
