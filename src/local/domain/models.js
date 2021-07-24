const { DataTypes, Model } = require('sequelize');
const db = require('../../database/domain')
const { Sequelize } = require('../../database/domain');


class Local extends Model { }
Local.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  percentageOfCC: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  monthlyUSD: {
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0,
    allowNull: false
  },
  prontoPago: {
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0,
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0,
    allowNull: false
  }, prontoPagoDate: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  }
}, { sequelize: db, modelName: 'locales' });

module.exports = Local;
