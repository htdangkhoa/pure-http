// mock setImmediate is undefined.
const path = require('path');
const { getMimeType } = require('../../lib/mime');

describe(`Get the mimetype from file's path.`, () => {
  it(`Should be return 'text/html'.`, async (done) => {
    const pathname = path.resolve(process.cwd(), 'tests/mime/.env');

    const ext = getMimeType(pathname);

    expect(ext).toBe('text/html');

    done();
  });
});
