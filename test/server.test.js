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

describe('PUT /', () => {
  it('When a method is not allowed, the http status code should be 405.', async () => {
    await request.put('/').expect(405);
  });
});

describe('ALL /status', () => {
  it('An object should be returned.', async () => {
    await request.post('/status').expect({ success: true });
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
