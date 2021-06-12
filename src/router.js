const Router = require('express').Router();

Router.use('/users', require('./users/controllers/router.js'))

module.exports = Router
