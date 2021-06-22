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
  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
}, {sequelize: db, modelName: 'exchanges'});

module.exports = Exchange;
