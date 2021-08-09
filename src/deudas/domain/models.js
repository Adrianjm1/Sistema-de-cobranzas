const { DataTypes, Model } = require('sequelize');
const db = require('../../database/domain');

class Deudas extends Model {}
Deudas.init({
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
  month: {
    type: DataTypes.STRING(15),
    allowNull: false
  }

}, {sequelize: db, modelName: 'deudas'});

module.exports = Deudas;
