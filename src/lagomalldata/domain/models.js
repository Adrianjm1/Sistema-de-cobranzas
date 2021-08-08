const { DataTypes, Model } = require('sequelize');
const db = require('../../database/domain')

class LagoMallData extends Model {}
LagoMallData.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  month: {
    type: DataTypes.DATEONLY(),
    allowNull: false
  },
  breakeven: {
    type: DataTypes.DECIMAL(4,2),
    allowNull: false
  },
  meter: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  discount:{
    type: DataTypes.INTEGER,
    allowNull: false

  }, prontoPagoDay: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {sequelize: db, modelName: 'lagoMallData'});

module.exports = LagoMallData;
