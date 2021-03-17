const supertest = require('supertest');

const app = require('./server');

const request = supertest(app);

describe('GET /get-cache', () => {
  it('should respond with jsonp', async () => {
    await request.get('/get-cache').expect(200);
  });
});

describe('POST /set-cache', () => {
  it('should respond with jsonp', async () => {
    await request.post('/set-cache').expect(200);
  });
});

describe('GET /jsonp-with-escape', () => {
  it('should respond with jsonp', async () => {
    await request
      .get('/jsonp-with-escape')
      .query({ callback: 'foo' })
      .expect('content-type', 'text/javascript;charset=utf-8')
      .expect(200, /foo\({"\\u0026":"\\u2028\\u003cscript\\u003e\\u2029"}\)/);
  });
});
