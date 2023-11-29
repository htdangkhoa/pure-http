/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
const supertest = require('supertest');

describe('ALL /not-found', () => {
  it(`The status should be 404.`, async () => {
    const app = require('./custom')();

    const request = supertest(app);

    const res = await request.get('/custom');

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Something went wrong.');
  });
});
