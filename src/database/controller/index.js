const Database = require('../domain');

// sync
async function init() {
  try {
    await Database.sync()
    console.log(`Base de datos conectada`)
  } catch (e) {
    console.log(e)
  }
}

module.exports = init;
