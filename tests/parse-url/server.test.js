// mock setImmediate is undefined.
global.setImmediate = undefined;

const supertest = require('supertest');

const app = require('./server');

const request = supertest(app);

describe('ALL /parse-undefined-url', () => {
  it(`The response body should be {}.`, async (done) => {
    const res = await request.post('/parse-undefined-url');

    expect(JSON.stringify(res.body)).toBe(JSON.stringify({}));

    done();
  });
});
