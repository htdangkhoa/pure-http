const path = require('path');
const consolidate = require('consolidate');
const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pureHttp = require('../..');

module.exports = function (options) {
  const viewsPath = path.resolve(process.cwd(), 'tests/views');

  const defaultOptions = {
    views: {
      dir: viewsPath,
      ext: 'html',
      engine: consolidate.swig,
    },
  };

  const app = pureHttp(options || defaultOptions);

  app.use([
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    cookieParser(),
    timeout('3s'),
  ]);

  app.all('/render', (req, res) => {
    res.render('index', { data: 'Hello World!' });
  });

  app.all('/render-ejs-error', (req, res) => {
    res.render('ejs', { data: 'Hello World!' });
  });

  app.all('/render-with-options', (req, res) => {
    res.render('index', (error, html) => {
      return res.send(html, { 'content-type': 'text/html; charset=utf-8' });
    });
  });

  return app;
};
