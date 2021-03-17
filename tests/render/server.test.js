const path = require('path');
const supertest = require('supertest');
const consolidate = require('consolidate');

const app = require('./server');

const viewsPath = path.resolve(process.cwd(), 'tests/views');

describe('ALL /render with error when views `dir` is not a string.', () => {
  it(`The status should be 500.`, async () => {
    const request = supertest(
      app({
        views: {
          dir: false,
        },
      }),
    );

    await request.post('/render').expect(500);
  });
});

describe('ALL /render with error when views `ext` is not a string.', () => {
  it(`The status should be 500.`, async () => {
    const request = supertest(
      app({
        views: {
          dir: viewsPath,
          ext: false,
        },
      }),
    );

    await request.post('/render').expect(500);
  });
});

describe('ALL /render with error when views `engine` is not a function.', () => {
  it(`The status should be 500.`, async () => {
    const request = supertest(
      app({
        views: {
          dir: viewsPath,
          ext: 'html',
          engine: false,
        },
      }),
    );

    await request.post('/render').expect(500);
  });
});

describe('ALL /render-ejs-error', () => {
  it(`The status should be 503.`, async () => {
    const request = supertest(
      app({
        views: {
          dir: viewsPath,
          ext: 'html',
          engine: consolidate.ejs,
        },
      }),
    );

    await request.post('/render-ejs-error').expect(503);
  });
});

describe('ALL /render', () => {
  it(`The 'content-type' in header should be 'text/html;charset=utf-8'.`, async () => {
    const request = supertest(
      app({
        views: {
          dir: viewsPath,
          ext: 'html',
          engine: consolidate.swig,
        },
      }),
    );

    await request
      .post('/render')
      .expect('content-type', 'text/html;charset=utf-8');
  });
});

describe('ALL /render-with-options', () => {
  it(`The 'content-type' in header should be 'text/html;charset=utf-8'.`, async () => {
    const request = supertest(
      app({
        views: {
          dir: viewsPath,
          ext: 'html',
          engine: consolidate.swig,
        },
      }),
    );

    await request
      .post('/render-with-options')
      .expect('content-type', 'text/html;charset=utf-8');
  });
});
