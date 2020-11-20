const { regexToParams } = require('./utils');

class Router {
  constructor(options) {
    const { isChild = false, prefix } = options || {};

    this.isChild = isChild;

    this.prefix = prefix;

    this.routes = [];

    this.get = this.addRoute.bind(this, 'GET');
    this.post = this.addRoute.bind(this, 'POST');
    this.put = this.addRoute.bind(this, 'PUT');
    this.patch = this.addRoute.bind(this, 'PATCH');
    this.delete = this.addRoute.bind(this, 'DELETE');
    this.head = this.addRoute.bind(this, 'HEAD');
    this.options = this.addRoute.bind(this, 'OPTIONS');
    this.trace = this.addRoute.bind(this, 'TRACE');
    this.all = this.addRoute.bind(this, '');

    this.use = this.addMiddleware.bind(this);
  }

  addRoute(method, route, ...handlers) {
    const { keys, pattern } = regexToParams(route);

    const fns = (handlers || []).filter(
      (handler) => typeof handler === 'function',
    );

    this.routes.push({ keys, pattern, fns, method, path: route });

    return this;
  }

  addMiddleware(...args) {
    let route = '/';

    const handlers = [];

    if (this.prefix) {
      route = this.prefix + route;
    }

    const hasPath = typeof args[0] === 'string';

    if (hasPath) {
      route = args[0];
    }

    function assertMiddleware(handler) {
      if (typeof handler !== 'function' && !(handler instanceof Router)) {
        throw new Error('Middleware must be a function!');
      }
    }

    for (let i = hasPath ? 1 : 0; i < args.length; i += 1) {
      const tmp = args[i];

      if (Array.isArray(tmp)) {
        for (let j = 0; j < tmp.length; j += 1) {
          const t = tmp[j];

          assertMiddleware(t);

          handlers.push(t);
        }
      } else {
        assertMiddleware(tmp);

        handlers.push(tmp);
      }
    }

    const { keys, pattern } = regexToParams(route, true);

    if (!this.isChild) {
      const routers = (handlers || []).filter((fn) => fn instanceof Router);

      for (let i = 0; i < routers.length; i += 1) {
        const router = routers[i];

        for (let j = 0; j < router.routes.length; j += 1) {
          const { path, fns, method } = router.routes[j];

          const { keys: newKey, pattern: newPattern } = regexToParams(
            route + path,
          );

          this.routes.push({ keys: newKey, pattern: newPattern, fns, method });
        }
      }
    }

    const fns = (handlers || []).filter(
      (handler) => typeof handler === 'function',
    );

    this.routes.push({ keys, pattern, fns, method: '', isMiddleware: true });

    return this;
  }

  lookup(req, res, callback) {
    let matches = [];

    const params = {};

    let handlers = [];

    this.routes.sort((a, b) => {
      if (b.isMiddleware) return 1;

      return 0;
    });

    let count = 0;

    for (let i = 0; i < this.routes.length; i += 1) {
      const { keys, pattern, method, fns, isMiddleware } = this.routes[i];

      const url = req.url.split('?')[0];

      let foundPath = false;

      if (!keys) {
        matches = pattern.exec(url);

        if (matches && matches.group) {
          for (const key in matches.group) {
            if (Object.prototype.hasOwnProperty.call(key, matches.group)) {
              const value = matches.group[key];

              params[key] = value;
            }
          }

          foundPath = true;
        }
      } else if (keys.length > 0) {
        matches = pattern.exec(url);

        if (matches) {
          for (let j = 0; j < keys.length; j += 1) {
            params[keys[j]] = matches[j + 1];
          }

          foundPath = true;
        }
      } else if (pattern.test(url)) {
        foundPath = true;
      }

      if (foundPath) {
        if (isMiddleware) {
          handlers = handlers.concat(fns || []);

          count = 0;
        } else {
          if (method === req.method) {
            handlers = handlers.concat(fns || []);

            count = 0;

            break;
          }

          count += 1;
        }
      }
    }

    if (count !== 0) {
      const e = new Error('Method Not Allowed.');

      e.statusCode = 405;

      return callback(e);
    }

    req.params = params;

    handlers.push((_req, _res) => {
      const e = new Error(`Cannot ${req.method} ${req.url}`);

      e.statusCode = 404;

      return callback(e);
    });

    let id = -1;

    function next(error) {
      if (error) {
        return setImmediate(() => callback(error));
      }

      if (id >= handlers.length - 1) {
        return setImmediate(() => callback());
      }

      id += 1;

      const fn = handlers[id];

      return setImmediate(() => {
        try {
          fn(req, res, next);
        } catch (err) {
          next(err);
        }
      });
    }

    return next();
  }
}

module.exports = Router;
