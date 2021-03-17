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

app.post('/set-response-cookie', (req, res) => {
  res.cookie('foo', 'bar');
  res.cookie('ping', 'pong', { sameSite: true });
  res.cookie('lax', 'lax', { sameSite: 'lax' });
  res.cookie('strict', 'strict', { sameSite: 'strict' });
  res.cookie('none', 'none', { sameSite: 'none' });

  res.send('Ok');
});

app.post('/clear-cookie', (req, res) => {
  res.clearCookie('foo').clearCookie('ping');

  res.send('Ok');
});

app.get('/get-request-cookie', (req, res) => {
  res.send(req.cookies);
});

app.all('/cookie', (req, res) => {
  res.cookie('test', 'test', {
    sameSite: 1,
    maxAge: 60000,
    httpOnly: true,
    secure: true,
    domain: req.originalUrl,
  });
});

app.all('/cookie-max-age', (req, res) => {
  res.cookie('test', 'test', {
    sameSite: 1,
    maxAge: {},
    httpOnly: true,
    secure: true,
    domain: req.originalUrl,
  });
});

module.exports = app;
