const supertest = require('supertest');
const cookie = require('cookie');

const app = require('./server');

const request = supertest(app);

describe('GET /', () => {
  it('A string should be returned.', async () => {
    await request.get('/').expect('GET');
  });
});

describe('POST /', () => {
  it('A string should be returned.', async () => {
    await request.post('/').expect('POST');
  });
});

describe('ALL /status', () => {
  it('An object should be returned.', async (done) => {
    const res = await request.post('/status');

    expect(res.body).toMatchObject({ success: true });

    expect(res.status).toBe(302);

    done();
  });
});

describe('ALL /timeout', () => {
  it('The status should be 503.', async () => {
    await request.post('/timeout').expect(503);
  });
});

describe('GET /api/hello/{name}', () => {
  it('A string should be returned.', async () => {
    const name = 'Khoa';

    await request.get(`/api/hello/${name}`).expect(`Hello ${name}`);
  });
});

describe('GET /api/query?s={...}', () => {
  it('A string should be returned.', async () => {
    const s = 'gogole';

    await request.get('/api/query').query({ s }).expect(`Query: ${s}`);
  });
});

describe('POST /api/search/{s}?', () => {
  it('An object should be returned.', async () => {
    await request.post(`/api/search`).expect({ hasParams: false });
  });
});

describe('POST /api/post-body', () => {
  it('An object should be returned.', async () => {
    const body = {
      email: 'abc@gmail.com',
      password: '1',
    };

    await request.post('/api/post-body').send(body).expect(body);
  });
});

describe('POST /api/sub-router/test', () => {
  it('The result should be a string like /api/sub-router/test.', async () => {
    await request.get('/api/sub-router/test').expect('/api/sub-router/test');
  });
});

describe('GET /not-found', () => {
  it('Http status code should be 404.', async () => {
    await request.get('/not-found').expect(404);
  });
});

describe('GET /set-cookie', () => {
  it(`The 'foo' should be equal 'bar' and the 'ping' should be equal 'pong'.`, async (done) => {
    const res = await request.get('/set-cookie');

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

describe('POST /set-cookie', () => {
  it(`The cookie must be set in request.`, async () => {
    await request
      .post('/set-cookie')
      .set('Cookie', ['foo=bar', 'ping=pong'])
      .expect({ foo: 'bar', ping: 'pong' });
  });
});

describe('GET /jsonp', () => {
  it('should respond with jsonp', async () => {
    await request
      .get('/jsonp')
      .query({ callback: 'foo' })
      .expect('content-type', 'text/javascript;charset=utf-8')
      .expect(200, /foo\(\{"message":"Hello World!"\}\);/);
  });
});

describe('ALL /send-file', () => {
  it(`The 'content-type' in header should be 'text/css;charset=utf-8'.`, async () => {
    await request
      .post('/send-file')
      .expect('cache-control', 'no-store')
      .expect('content-type', 'text/css;charset=utf-8');
  });
});

describe('ALL /render', () => {
  it(`The 'content-type' in header should be 'text/html;charset=utf-8'.`, async () => {
    await request
      .post('/render')
      .expect('content-type', 'text/html;charset=utf-8');
  });
});
