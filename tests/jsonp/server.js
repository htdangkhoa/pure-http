const http = require('http');
const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pureHttp = require('../..');

const app = pureHttp({
  cache: pureHttp.Cache({ maxAge: 60000 }),
  server: http.createServer(),
});

app.use([
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  cookieParser(),
  timeout('3s'),
]);

app.get('/jsonp', (req, res) => {
  res.jsonp({
    message: 'Hello World!',
  });
});

app.get('/jsonp-with-escape', (req, res) => {
  res.jsonp({ '&': '\u2028<script>\u2029' }, { escape: true });
});

module.exports = app;
