const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pureHttp = require('../..');

const sleep = (fn, wait) =>
  new Promise((resolve) => setTimeout(() => resolve(fn()), wait));

module.exports = function (options) {
  const opts = { maxAge: 60000, max: 2 };
  Object.assign(opts, options);

  const app = pureHttp({
    cache: pureHttp.Cache(opts),
  });

  app.use([
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    cookieParser(),
    timeout('30s'),
    (req, res, next) => {
      req.app.cache.has({});
      req.app.cache.get({});

      req.app.cache.set('/get-cache', {
        raw: JSON.stringify('data'),
        method: 'GET',
        headers: { 'X-Timezone': 'Asia/Ho_Chi_Minh' },
      });

      req.app.cache.set('/override-key', {
        raw: JSON.stringify('data'),
        method: 'POST',
        headers: { 'X-Timezone': 'Asia/Ho_Chi_Minh' },
      });

      return next();
    },
  ]);

  app.get('/get-cache', (req, res) => {
    res.send('data', true);
  });

  app.post('/override-key', (req, res) => {
    res.send('test', true);
  });

  app.post('/set-cache', (req, res) => res.send('data', true));

  app.delete('/delete-cache', (req, res) => {
    const cache = pureHttp.Cache({ maxAge: 5 });

    cache.set('1', req.originalUrl);
    cache.set('2', req.originalUrl);
    cache.delete('1');
    cache.delete({});

    sleep(() => {
      cache.get('2');
      cache.delete('2');

      res.send('Ok');
    }, 3000);
  });

  app.get('/jsonp-with-escape', (req, res) => {
    res.jsonp({ '&': '\u2028<script>\u2029' }, true, { escape: true });
  });

  app.all('/error', (req) => {
    req.app.cache.set({}, 'error');
  });

  return app;
};
