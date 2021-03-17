const path = require('path');
const supertest = require('supertest');
const consolidate = require('consolidate');

const app = require('./server');

const viewsPath = path.resolve(process.cwd(), 'tests/views');

/* views */
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
