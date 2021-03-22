const supertest = require('supertest');

const app = require('./server');

const request = supertest(app);

describe('GET /jsonp', () => {
  it('should respond with jsonp', async () => {
    await request
      .get('/jsonp')
      .query({ callback: 'foo' })
      .expect('content-type', 'text/javascript; charset=utf-8')
      .expect(200, /foo\(\{"message":"Hello World!"\}\);/);
  });
});

describe('GET /jsonp-with-escape', () => {
  it('should respond with jsonp', async () => {
    await request
      .get('/jsonp-with-escape')
      .query({ callback: 'foo' })
      .expect('content-type', 'text/javascript; charset=utf-8')
      .expect(200, /foo\({"\\u0026":"\\u2028\\u003cscript\\u003e\\u2029"}\)/);
  });
});

describe('GET /jsonp-with-replacer', () => {
  it('should respond with jsonp', async () => {
    await request
      .get('/jsonp-with-replacer')
      .expect('content-type', 'application/json; charset=utf-8')
      .expect(200, '{"name":"tobi"}');
  });
});

describe('GET /jsonp-with-spaces', () => {
  it('should respond with jsonp', async () => {
    await request
      .get('/jsonp-with-spaces')
      .expect('content-type', 'application/json; charset=utf-8')
      .expect(200, '{\n  "name": "tobi",\n  "age": 2\n}');
  });
});
