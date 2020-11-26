const http = require('http');
const https = require('https');

const Router = require('./router');
const request = require('./request');
const response = require('./response');

function pureHttp(options) {
  const router = new Router();

  const { server: existedServer, onError, onNotFound } = options || {};

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

  async function errorHandler(req, res, error) {
    if (error && error.statusCode === 404) {
      if (onNotFound) {
        return await onNotFound(req, res);
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

      if (onError) {
        return await onError(error, req, res);
      }

      return res.send(
        statusCode === 500
          ? `Internal Server Error.\n\n${error.stack}`
          : message,
        statusCode,
      );
    }

    const e = new Error(message);

    if (onError) {
      return await onError(e, req, res);
    }

    return res.send(e.message, statusCode);
  }

  function requestListener(rq, rs) {
    const req = request(rq);

    const res = response(req, rs, options || {}, errorHandler);

    return router.lookup(req, res, errorHandler.bind(this, req, res));
  }

  server.on('request', requestListener);

  return server;
}

module.exports = pureHttp;
