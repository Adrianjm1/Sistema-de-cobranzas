const { Sequelize } = require('sequelize');

// Dirección de la DB.
module.exports = new Sequelize('lagomall', 'root', '', {dialect: 'mysql',logging: true });
