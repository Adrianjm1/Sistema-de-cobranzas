const { DataTypes, Model } = require('sequelize');
const db = require('../../database/domain')

class Customer extends Model {}
Customer.init({

}, {sequelize: db, modelName: 'customers'});

module.exports = Customer;
