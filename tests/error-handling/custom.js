const pureHttp = require('../..');

module.exports = function () {
  const app = pureHttp();

  app.get(
    '/custom',
    (_req, _res, _next) => {
      throw new Error('bad');
    },
    /* istanbul ignore next */
    // ignore coverage for this function because it will never be called.
    (req, res, _next) => {
      res.send('good');
    },
  );

  app.use((error, req, res, _next) => {
    res.send('Something went wrong.', 500);
  });

  return app;
};
