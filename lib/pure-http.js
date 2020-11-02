const http = require('http');

const methods = require('./methods');
const request = require('./request');
const response = require('./response');
const { useMiddlewares, useRoutes } = require('./utils');

class PureHttp {
  constructor() {
    for (let i = 0; i < methods.length; i += 1) {
      const method = methods[i];

      if (!this.routeTable[method]) {
        Object.assign(this.routeTable, { [method]: [] });
      }

      const fun = async (path, handler) => {
        this.routeTable[method].push({ path, handler });
      };

      Object.assign(this, { [method]: fun });
    }

    const requestListener = async (rawReq, rawRes) => {
      const req = request(rawReq);

      const res = response(rawRes);

      await this.handle(req, res, async (error) => {
        if (error) {
          res.writeHead(500);

          return res.end('Internal Server Error.');
        }

        const i = req.url.lastIndexOf('/');

        const prefix = req.url.substring(0, i);

        return useRoutes(this.routeTable, req, res, prefix);
      });
    };

    return http.createServer(requestListener);
  }

  async handle(req, res, callback) {
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
