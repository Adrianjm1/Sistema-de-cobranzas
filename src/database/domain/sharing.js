
const Owner = require('../../owner/domain/model');
const Admin = require('../../admin/domain/model');
const Local = require('../../local/domain/models');
const LagoMallData = require('../../lagomalldata/domain/models');
const Payments = require('../../payments/domain/models');
const ExchangeRate = require('../../exchangeRate/domain/model');


// Owner - Local: One to Many
Owner.hasMany(Local, {foreignKey: 'idOwner'});
Local.belongsTo(Owner, {foreignKey: 'idOwner'});

// LagoMallData - Local: One to Many
LagoMallData.hasMany(Local, {foreignKey: 'idLGData'});
Local.belongsTo(LagoMallData, {foreignKey: 'idLGData'});

// Payments - Local: One to Many
Local.hasMany(Payments, {foreignKey: 'idLocal'});
Payments.belongsTo(Local,  {foreignKey: 'idLocal'})

// Payments - ExchangeRate: One to One
Payments.hasOne(ExchangeRate, {foreignKey: 'idExchangeRate'});
ExchangeRate.belongsTo(Payments, {foreignKey: 'idExchangeRate'});

// Admin - Local: One to Many
Admin.hasMany(Local, {foreignKey: 'idAdmin'});
Local.belongsTo(Admin, {foreignKey: 'idAdmin'});