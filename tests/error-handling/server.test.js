/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
const supertest = require('supertest');

const notFoundMiddleware = () => (req, res, next) =>
  res.send('Not found.', 404);

const errorMiddleware = () => (error, req, res, next) =>
  res.send('Error.', 500);

// No not found middleware & error middleware.
describe('ALL /error', () => {
  it(`The status should be 500.`, async () => {
    const app = require('./server')();
    const request = supertest(app);

    await request.post('/error').expect(500);
  });
});

describe('ALL /not-found', () => {
  it(`The status should be 404.`, async () => {
    const app = require('./server')();
    const request = supertest(app);

    await request.post('/not-found').expect(404);
  });
});

// Only not found middleware
describe('ALL /error', () => {
  it(`The status should be 500.`, async () => {
    const app = require('./server')();
    app.use(notFoundMiddleware());

    const request = supertest(app);

    await request.post('/error').expect(500);
  });
});

describe('ALL /not-found', () => {
  it(`The status should be 404 and the response text should be 'Not found.'.`, async () => {
    const app = require('./server')();
    app.use(notFoundMiddleware());

    const request = supertest(app);

    const res = await request.post('/not-found');

    expect(res.statusCode).toBe(404);

    expect(res.text).toBe('Not found.');
  });
});

// Only error middleware
describe('ALL /error', () => {
  it(`The status should be 500 and the response text should be 'Error.'.`, async () => {
    const app = require('./server')();
    app.use(errorMiddleware());

    const request = supertest(app);

    const res = await request.post('/error');

    expect(res.statusCode).toBe(500);

    expect(res.text).toBe('Error.');
  });
});

describe('ALL /not-found', () => {
  it(`The status should be 404.`, async () => {
    const app = require('./server')();
    app.use(errorMiddleware());

    const request = supertest(app);

    await request.post('/not-found').expect(404);
  });
});
