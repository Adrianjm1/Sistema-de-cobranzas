const Router = require('express').Router();

Router.use('/local', require('./local/controllers/router.js'))

module.exports = Router
