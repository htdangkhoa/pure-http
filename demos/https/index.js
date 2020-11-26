/* eslint-disable */
const pem = require('pem');
const https = require('https');
const bodyParser = require('body-parser');
const pureHttp = require('../..');

pem.createCertificate(
  { days: 1, selfSigned: true },
  (error, { clientKey, certificate }) => {
    const server = https.createServer({ key: clientKey, cert: certificate });

    const app = pureHttp({ server });

    app.use([bodyParser.json(), bodyParser.urlencoded({ extended: true })]);

    app.post('/', (req, res) => {
      res.send(req.body);
    });

    app.get('/error', (req, res) => {
      throw new Error('New error.');
    });

    app.get('/test', (req, res) => {
      res.send('Test.');
    });

    app.listen(3000, () => console.log('Server is listening on port 3000...'));
  },
);
