const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pureHttp = require('../..');

module.exports = function () {
  const app = pureHttp();

  app.use([
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    cookieParser(),
    timeout('3s'),
  ]);

  // eslint-disable-next-line no-unused-vars
  app.all('/error', (req, res) => {
    throw new Error('Error.');
  });

  return app;
};
