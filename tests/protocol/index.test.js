/* eslint-disable */
const supertest = require('supertest');
const pureHttp = require('../..');

describe('ALL /protocol', () => {
  it(`should respect X-Forwarded-Proto.`, async () => {
    const app = pureHttp();
    app.use((req, res) => {
      res.send(req.protocol);
    });

    const request = supertest(app);

    const res = await request.get('/').set('X-Forwarded-Proto', 'https');

    expect(res.text).toBe('https');
  });

  it(`should default to the socket addr if X-Forwarded-Proto not present.`, async () => {
    const app = pureHttp();
    app.use((req, res) => {
      req.connection.encrypted = true;

      res.send(req.protocol);
    });

    const request = supertest(app);

    const res = await request.get('/');

    expect(res.text).toBe('https');
  });
});
