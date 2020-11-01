import http from 'http';

import methods from './methods';
import { first, parseUrl, useMiddlewares, useRoutes } from './utils';

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
      const req = rawReq;

      const res = rawRes;

      let protocol = req.connection.encrypted ? 'https' : 'http';

      protocol = req.headers['x-forwarded-proto'] || protocol;

      protocol = first(protocol.split(/\s*,\s*/));

      const url = `${protocol}://${req.headers.host}${req.url}`;

      const URL = parseUrl(url);

      Object.assign(req, URL);

      res.send = (body) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify(body));
      };

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

    this.server = http.createServer(requestListener);
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

  listen(port, callback) {
    return this.server.listen({ port }, callback);
  }
}

PureHttp.prototype.routeTable = {};

PureHttp.prototype.stacks = [];

export default PureHttp;
