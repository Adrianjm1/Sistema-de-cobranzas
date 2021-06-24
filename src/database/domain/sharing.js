
const Owner = require('../../owner/domain/model');
const Admin = require('../../admin/domain/model');
const Local = require('../../local/domain/models');
const LagoMallData = require('../../lagomalldata/domain/models');
const Payments = require('../../payments/domain/models');

// Owner - Local: One to Many
Owner.hasMany(Local, {foreignKey: 'idOwner'});
Local.belongsTo(Owner, {foreignKey: 'idOwner'});

// LagoMallData - Local: One to Many
LagoMallData.hasMany(Local, {foreignKey: 'idLGData'});
Local.belongsTo(LagoMallData, {foreignKey: 'idLGData'});

// Payments - Local: One to Many
Local.hasMany(Payments, {foreignKey: 'idLocal'});
Payments.belongsTo(Local,  {foreignKey: 'idLocal'});

// Payments - Admin: One to Many
Admin.hasMany(Payments, {foreignKey: 'idAdmin'});
Payments.belongsTo(Admin,  {foreignKey: 'idAdmin'});

// Admin - Local: One to Many
Admin.hasMany(Local, {foreignKey: 'idAdmin'});
Local.belongsTo(Admin, {foreignKey: 'idAdmin'});