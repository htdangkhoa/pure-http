const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pureHttp = require('../..');

const app = pureHttp({
  cache: pureHttp.Cache({ maxAge: 60000 }),
});

app.use([
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  cookieParser(),
  timeout('3s'),
  (req, res, next) => {
    res.cache.set('/get-cache', {
      raw: JSON.stringify('data'),
      method: 'GET',
      headers: {},
    });

    return next();
  },
]);

app.get('/get-cache', (req, res) => res.send('data', true));

app.post('/set-cache', (req, res) => res.send('data', true));

app.get('/jsonp-with-escape', (req, res) => {
  res.jsonp({ '&': '\u2028<script>\u2029' }, true, { escape: true });
});

module.exports = app;
