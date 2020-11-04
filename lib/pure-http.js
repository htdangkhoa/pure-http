const http = require('http');
const https = require('https');

const request = require('./request');
const response = require('./response');
const { useMethods, useRoutes, useMiddlewares } = require('./utils');

class PureHttp {
  constructor(options) {
    const { server: existServer } = options || {};

    const requestListener = async (rawReq, rawRes) => {
      const req = request(rawReq);

      const res = response(rawRes);

      this.handle(req, res, async (error) => {
        if (error) {
          res.writeHead(500);

          return res.end('Internal Server Error.');
        }

        const i = req.url.lastIndexOf('/');

        const prefix = req.url.substring(0, i);

        return useRoutes(this.routeTable, req, res, prefix);
      });
    };

    let server = http.createServer();

    if (
      existServer instanceof http.Server ||
      existServer instanceof https.Server
    ) {
      server = existServer;
    }

    this.server = server;

    server.on('request', requestListener);

    useMethods(this.routeTable, this.server);

    this.server.use = (...args) => this.use(...args);

    return this.server;
  }

  handle(req, res, callback) {
    let id = -1;

    const next = (error) => {
      if (error) {
        return setImmediate(() => callback(error));
      }

      if (id >= this.stacks.length - 1) {
        return setImmediate(() => callback());
      }

      id += 1;

      const layer = this.stacks[id];

      return setImmediate(() => {
        try {
          if (req.url.match(layer.path)) {
            layer.handler(req, res, next);
          } else {
            next();
          }
        } catch (e) {
          next(e);
        }
      });
    };

    next();
  }

  use(...args) {
    return useMiddlewares(this.stacks, ...args);
  }
}

PureHttp.prototype.routeTable = {};

PureHttp.prototype.stacks = [];

module.exports = PureHttp;
