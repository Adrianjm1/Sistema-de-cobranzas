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
    allowNull: false
  },
  bank: {
    type: DataTypes.STRING(30),
    defaultValue: '',
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false  }
}, {sequelize: db, modelName: 'payments'});

module.exports = Payment;
