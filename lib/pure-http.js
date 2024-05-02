const http = require('http');
const https = require('https');

const locals = require('./locals');
const Router = require('./router');
const { defineGetter } = require('./utils');

function pureHttp(options) {
  const { server: existedServer, views: viewOptions, cache } = options || {};

  let server = http.createServer();

  if (
    existedServer instanceof http.Server ||
    existedServer instanceof https.Server
  ) {
    server = existedServer;
  }

  const router = new Router();

  server.set = locals.set.bind(server);
  server.get = function get() {
    if (arguments.length === 1) {
      const key = arguments[0];
      return locals.get.call(server, key);
    }

    return router.get.apply(router, arguments);
  };
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
    defineGetter(req, 'app', function () {
      return server;
    });
    defineGetter(res, 'views', function () {
      return viewOptions;
    });
    defineGetter(res, 'cache', function () {
      return cache;
    });

    return router.lookup(req, res);
  }

  server.on('request', requestListener);

  return server;
}

module.exports = pureHttp;
