const http = require('http');
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
    server: http.createServer(),
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

  return app;
};
