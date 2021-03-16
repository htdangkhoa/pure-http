const http = require('http');
const https = require('https');

const Router = require('./router');
const { defineProperty } = require('./utils');

function pureHttp(options) {
  const router = new Router();

  const { server: existedServer, views: viewOptions, cache } = options || {};

  let server = http.createServer();

  if (
    existedServer instanceof http.Server ||
    existedServer instanceof https.Server
  ) {
    server = existedServer;
  }

  server.get = router.get;
  server.post = router.post;
  server.put = router.put;
  server.patch = router.patch;
  server.delete = router.delete;
  server.head = router.head;
  server.options = router.options;
  server.trace = router.trace;
  server.connect = router.connect;
  server.all = router.all;

  server.use = router.use;

  function requestListener(req, res) {
    defineProperty(res, 'views', viewOptions);
    defineProperty(res, 'cache', cache);

    return router.lookup(req, res);
  }

  server.on('request', requestListener);

  return server;
}

module.exports = pureHttp;
