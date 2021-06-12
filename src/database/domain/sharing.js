const Owner = require('../../owner/domain/model');
//require all entities

Owner.hasMany(Local, {foreignKey: 'idOwner'});
Local.belongsTo(Owner, {foreignKey: 'idOwner'});
