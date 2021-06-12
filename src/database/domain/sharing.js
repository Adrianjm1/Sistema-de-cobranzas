const Owner = require('../../owner/domain/model');

Owner.hasMany(Local, {foreignKey: 'idOwner'});
Local.belongsTo(Owner, {foreignKey: 'idOwner'});
