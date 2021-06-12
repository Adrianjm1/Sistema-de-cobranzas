var expect = require('expect.js');

const query = `select 1 + 1 as result from clinicas limit 1`;

describe('Database', function() {

  describe('#1 Conexion', function() {
    it('Select 1+1', async function() {
      const data = await db.raw(query);

      const { result } = data[0][0];

      expect(result).to.be.a('number') && expect(result).to.be(2)
    });
  });

});
