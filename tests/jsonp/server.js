const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pureHttp = require('../..');

const app = pureHttp();

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

app.get('/jsonp-with-replacer', (req, res) => {
  res.jsonp(
    { name: 'tobi', _id: 12345 },
    {
      replacer: (key, val) => {
        return key[0] === '_' ? undefined : val;
      },
    },
  );
});

app.get('/jsonp-with-spaces', (req, res) => {
  res.jsonp({ name: 'tobi', age: 2 }, { spaces: 2 });
});

module.exports = app;
