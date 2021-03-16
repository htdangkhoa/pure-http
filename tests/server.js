const http = require('http');
const path = require('path');
const consolidate = require('consolidate');
const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pureHttp = require('..');
const router = require('./router');

const viewsPath = path.resolve(process.cwd(), 'tests/views');

const app = pureHttp({
  cache: pureHttp.Cache({ maxAge: 60000 }),
  views: {
    dir: viewsPath,
    ext: 'html',
    engine: consolidate.swig,
  },
  server: http.createServer(),
});

app.use([
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  cookieParser(),
  timeout('3s'),
]);

app.get('/', (req, res) => {
  res.send('GET');
});

app.post('/', (req, res) => {
  res.send('POST');
});

app.use('/', router);

app.all('/status', (req, res) => res.json({ success: true }, 302));

app.all('/get-header', (req, res) => {
  const host = req.header('host');

  res.send(host);
});

// eslint-disable-next-line no-unused-vars
app.all('/timeout', async (req, res) => {
  const sleep = (wait) => new Promise((resolve) => setTimeout(resolve, wait));

  await sleep(5000);
});

app.get('/set-cookie', (req, res) => {
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

app.post('/set-cookie', (req, res) => {
  res.send(req.cookies);
});

app.all('/send-file', (req, res) => {
  const filePath = path.resolve(process.cwd(), 'tests/index.css');

  res.sendFile(filePath, { headers: { 'Cache-Control': 'no-store' } });
});

app.get('/jsonp', (req, res) => {
  res.jsonp({
    message: 'Hello World!',
  });
});

app.all('/render', (req, res) => {
  res.render('index', { data: 'Hello World!' });
});

// eslint-disable-next-line no-unused-vars
app.all('/error', (req, res) => {
  res.cookie('test', 'test', {
    sameSite: 1,
    maxAge: 60000,
    httpOnly: true,
    secure: true,
    domain: req.host,
  });

  throw new Error('Internal server error.');
});

module.exports = app;
