const { DataTypes, Model } = require('sequelize');
const db = require('../../database/domain')

class Exchange extends Model {}
Exchange.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: ''
  }
}, {sequelize: db, modelName: 'exchanges'});

module.exports = Exchange;
