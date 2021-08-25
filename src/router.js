const Router = require('express').Router();

Router.use('/owner', require('./owner/controllers/router.js'));
Router.use('/deudas', require('./deudas/controllers/router.js'));
Router.use('/local', require('./local/controllers/router.js'));
Router.use('/lagomalldata', require('./lagomalldata/controllers/router.js'));
Router.use('/payments', require('./payments/controllers/router.js'));
Router.use('/admin', require('./admin/controllers/router.js'));
Router.use('/pdf', require('./pdf/controllers/router'));


module.exports = Router
