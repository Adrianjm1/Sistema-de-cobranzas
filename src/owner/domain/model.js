const { DataTypes, Model } = require('sequelize');
const db = require('../../database/domain')

class Owner extends Model {}
Owner.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  nationalID: {
    type: DataTypes.STRING(12),
    defaultValue: '',
    allowNull: false
  },
  phone:{
    type: DataTypes.STRING(20),
    defaultValue: '',
    allowNull: false
  }


}, {sequelize: db, modelName: 'owners'});

module.exports = Owner;
