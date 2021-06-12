const { DataTypes, Model } = require('sequelize');
const db = require('../../database/domain')

class AdminMaster extends Model {}
AdminMaster.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  adminName: {
    type: DataTypes.STRING(30),
    allowNull: false
  },

}, {sequelize: db, modelName: 'adminMaster'});

module.exports = AdminMaster;
