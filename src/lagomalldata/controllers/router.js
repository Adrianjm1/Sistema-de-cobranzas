const Router = require('express').Router();
const Controller = require('./index.js');

Router.get('/', Controller.getAll)


module.exports = Router
