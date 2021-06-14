const { DataTypes, Model } = require('sequelize');
const db = require('../../database/domain')

class Admin extends Model {}
Admin.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
}, {sequelize: db, modelName: 'admins'});

module.exports = Admin;
