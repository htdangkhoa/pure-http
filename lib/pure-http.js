const http = require('http');
const https = require('https');

const Router = require('./router');
const request = require('./request');
const response = require('./response');

function pureHttp(options) {
  const router = new Router();

  const { server: existedServer, errorHandler, defaultRoute } = options || {};

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
  server.all = router.all;

  server.use = router.use;

  function requestListener(rq, rs) {
    const req = request(rq);

    const res = response(rs);

    return router.lookup(req, res, async (error) => {
      if (error && error.statusCode === 404) {
        if (defaultRoute) {
          return await defaultRoute(req, res);
        }

        return res.send(error.message, error.statusCode);
      }

      let statusCode = 500;

      let message = 'Internal Server Error.';

      if (error) {
        message = error.message;

        if (error.statusCode) {
          statusCode = error.statusCode;
        }

        if (errorHandler) {
          return await errorHandler(error, req, res);
        }

        return res.send(
          statusCode === 500
            ? `Internal Server Error.\n\n${error.stack}`
            : message,
          statusCode,
        );
      }

      const e = new Error(message);

      if (errorHandler) {
        return await errorHandler(e, req, res);
      }

      return res.send(e.message, statusCode);
    });
  }

  server.on('request', requestListener);

  return server;
}

module.exports = pureHttp;
