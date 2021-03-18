const http = require('http');
const path = require('path');
const fs = require('fs');
const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pureHttp = require('../..');
const router = require('./router');

const app = pureHttp({
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

app.all('/send-file', (req, res) => {
  const filePath = path.resolve(process.cwd(), 'tests/public/index.css');

  res.sendFile(filePath, { headers: { 'Cache-Control': 'no-store' } });
});

app.all('/set-header', (req, res) => {
  res.header('X-Test', 'Hello World!');

  res.send(200);
});

app.all('/set-status', (req, res) => {
  res.status(400);

  res.send('Bad request.');
});

app.all('/redirect', (req, res) => {
  res.redirect('/');
});

app.all('/redirect-with-status', (req, res) => {
  if (req.query.numberFist) {
    return res.redirect(200, '/');
  }

  return res.redirect('/', 200);
});

app.all('/stream-image', (req, res) => {
  const imgPath = path.resolve(process.cwd(), 'tests/public/image.png');

  const readableStream = fs.createReadStream(imgPath);

  return res.send(readableStream);
});

app.all('/download-image', (req, res) => {
  const imgPath = path.resolve(process.cwd(), 'tests/public/image.png');

  const readableStream = fs.createReadStream(imgPath);

  const chunks = [];

  readableStream.on('data', (chunk) => chunks.push(chunk));
  readableStream.on('end', () => {
    const buffer = Buffer.concat(chunks);

    return res.send(buffer);
  });
});

app.all('/wild/:uid/*', (req, res) => res.send({ uid: req.params.uid }));

module.exports = app;
