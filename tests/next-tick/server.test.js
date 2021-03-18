// mock setImmediate is undefined.
global.setImmediate = undefined;

const supertest = require('supertest');

const app = require('./server');

const request = supertest(app);

describe('ALL /ping', () => {
  it(`The status should be 200.`, async () => {
    await request.post('/ping').expect(200);
  });
});
