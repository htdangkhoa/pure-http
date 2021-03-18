const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pureHttp = require('../..');
const { parseUrl } = require('../../lib/utils');

const app = pureHttp();

app.use([
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  cookieParser(),
  timeout('3s'),
]);

app.all('/parse-undefined-url', (req, res) => res.send(parseUrl('foo_bar')));

module.exports = app;
