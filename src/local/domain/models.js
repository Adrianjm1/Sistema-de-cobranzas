const { DataTypes, Model } = require('sequelize');
const db = require('../../database/domain')

class Local extends Model {}
Local.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
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
    type: DataTypes.DECIMAL(8,2),
    defaultValue: 0
  },
  balance: {
    type: DataTypes.DECIMAL(8,2),
    defaultValue: 0
  }
}, {sequelize: db, modelName: 'locales'});

module.exports = Local;
