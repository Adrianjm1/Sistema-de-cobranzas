const { DataTypes, Model } = require('sequelize');
const db = require('../../database/domain');

class Payment extends Model {}
Payment.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  amountUSD: {
    type: DataTypes.DECIMAL(8,2),
    allowNull: false
  },
  referenceNumber: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bank: {
    type: DataTypes.STRING(30),
    defaultValue: '',
    allowNull: false
  },
  exchangeRate: {
    type: DataTypes.DECIMAL(20,3),
    defaultValue: 0,
    allowNull: false
  },
  paymentUSD: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  restanteUSD: {
    type: DataTypes.DECIMAL(8,2),
    allowNull: false
  },
  date: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(80),
    allowNull: true
  } 
}, {sequelize: db, modelName: 'payments'});

module.exports = Payment;
