const path = require('path');
const bodyParser = require('body-parser');
const pureHttp = require('..');
const router = require('./router');

const app = pureHttp({
  cache: pureHttp.Cache({ maxAge: 60000 }),
});

app.use([bodyParser.json(), bodyParser.urlencoded({ extended: true })]);

app.get('/', (req, res) => {
  res.send('GET');
});

app.post('/', (req, res) => {
  res.send('POST');
});

app.use('/', router);

app.all('/status', (req, res) => res.status(200).json({ success: true }));

app.get('/set-cookie', (req, res) => {
  res.cookie('foo', 'bar');
  res.cookie('ping', 'pong');

  res.send('Ok');
});

app.post('/set-cookie', (req, res) => {
  res.send(req.cookies);
});

app.all('/send-file', (req, res) => {
  const filePath = path.resolve(process.cwd(), 'tests/index.css');

  res.sendFile(filePath, { headers: { 'Cache-Control': 'no-store' } });
});

module.exports = app;
