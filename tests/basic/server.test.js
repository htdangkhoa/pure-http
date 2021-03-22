const supertest = require('supertest');

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

describe('ALL /get-header', () => {
  it('The status should be 503.', async (done) => {
    const res = await request.get('/get-header');

    expect(typeof res.text).toBe('string');

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

describe('ALL /set-header', () => {
  it(`The 'X-Test' header should be 'Hello World!'.`, async () => {
    await request.post('/set-header').expect('X-Test', 'Hello World!');
  });
});

describe('ALL /set-status', () => {
  it(`The status should be 400.`, async () => {
    await request.post('/set-status').expect(400);
  });
});

describe('ALL /redirect', () => {
  it(`The location should be /.`, async () => {
    await request.post('/redirect').expect('location', '/').expect(302);
  });
});

describe('ALL /redirect-with-status', () => {
  it(`The location should be / and the status should be 200.`, async () => {
    await request
      .get('/redirect-with-status')
      .expect('location', '/')
      .expect(200);
  });
});

describe('ALL /redirect-with-status', () => {
  it(`The location should be / and the status should be 200.`, async () => {
    await request
      .get('/redirect-with-status')
      .query('numberFist', true)
      .expect('location', '/')
      .expect(200);
  });
});

describe('ALL /wild/:uid/*', () => {
  it(`The uid from response should be '1'.`, async (done) => {
    const res = await request.get('/wild/1/*');

    expect(res.body.uid).toBe('1');

    done();
  });
});
