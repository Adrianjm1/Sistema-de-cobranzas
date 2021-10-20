const { Sequelize } = require('sequelize');

// Dirección de la DB.
module.exports = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, { host: process.env.DBHOST, dialect: 'mysql' });
