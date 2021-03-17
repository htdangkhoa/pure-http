const supertest = require('supertest');
const cookie = require('cookie');

const app = require('./server');

const request = supertest(app);

describe('POST /set-response-cookie', () => {
  it(`The 'foo' should be equal 'bar' and the 'ping' should be equal 'pong'.`, async (done) => {
    const res = await request.post('/set-response-cookie');

    const cookies = res.headers['set-cookie'];

    const cookie1 = cookie.parse(cookies[0]);
    expect(cookie1.foo).toBe('bar');

    const cookie2 = cookie.parse(cookies[1]);
    expect(cookie2.ping).toBe('pong');

    done();
  });
});

describe('POST /clear-cookie', () => {
  it(`The 'foo' should be empty and the 'ping' should be empty.`, async (done) => {
    const res = await request.post('/clear-cookie');

    const cookies = res.headers['set-cookie'];

    const cookie1 = cookie.parse(cookies[0]);
    expect(cookie1.foo).toBe('');

    const cookie2 = cookie.parse(cookies[1]);
    expect(cookie2.ping).toBe('');

    done();
  });
});

describe('get /get-request-cookie', () => {
  it(`The cookie must be set in request.`, async () => {
    await request
      .get('/get-request-cookie')
      .set('Cookie', ['foo=bar', 'ping=pong'])
      .expect({ foo: 'bar', ping: 'pong' });
  });
});

describe('ALL /cookie', () => {
  it(`The status should be 500.`, async () => {
    await request.post('/cookie').expect(500);
  });
});

describe('ALL /cookie-max-age', () => {
  it(`The status should be 500.`, async () => {
    await request.post('/cookie-max-age').expect(500);
  });
});
