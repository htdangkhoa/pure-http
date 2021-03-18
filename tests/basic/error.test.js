describe('The middleware is not a function.', () => {
  it(`Should be throw the error.`, async (done) => {
    // eslint-disable-next-line global-require
    const pureHttp = require('../..');

    const app = pureHttp();

    try {
      app.use(1);
    } catch (error) {
      done();
    }
  });
});
