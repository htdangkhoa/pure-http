// mock setImmediate is undefined.
global.setImmediate = undefined;

const supertest = require('supertest');

const app = require('./server');

const request = supertest(app);

describe('ALL /foo/bar', () => {
  it(`The status should be 200.`, async () => {
    await request.post('/foo/bar').expect(200);
  });
});

describe('ALL /movies/:title.(mp4|mov)', () => {
  it(`The status should be 200.`, async () => {
    await request.post('/movies/star-wars.mp4').expect(200);
    await request.post('/movies/star-wars.mov').expect(200);
  });
});
