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
  }

  addMiddleware(...args) {
    if (typeof args[0] !== 'string' && !Array.isArray(args[0])) {
      throw new Error('Middleware must be a function!');
    }

    let route = '/';

    const handlers = [];

    if (this.prefix) {
      route = this.prefix + route;
    }

    const hasPath = typeof args[0] === 'string';

    if (hasPath) {
      route = args[0];
    }

    for (let i = hasPath ? 1 : 0; i < args.length; i += 1) {
      const tmp = args[i];

      if (Array.isArray(tmp)) {
        for (let j = 0; j < tmp.length; j += 1) {
          const t = tmp[j];

          handlers.push(t);
        }
      } else {
        handlers.push(tmp);
      }
    }

    for (let i = 0; i < handlers.length; i += 1) {
      const handler = handlers[i];

      if (typeof handler !== 'function' && !(handler instanceof Router)) {
        throw new Error('Middleware must be a function!');
      }
    }

    const { keys, pattern } = regexToParams(route, true);

    if (!this.isChild) {
      const routers = (handlers || []).filter((fn) => fn instanceof Router);

      for (let i = 0; i < routers.length; i += 1) {
        const router = routers[i];

        const newRoutes = router.routes.map(({ path, fns, method }) => {
          const { keys: newKey, pattern: newPattern } = regexToParams(
            route + path,
          );

          return { keys: newKey, pattern: newPattern, fns, method };
        });

        for (let j = 0; j < newRoutes.length; j += 1) {
          const r = newRoutes[j];

          this.routes.push(r);
        }
      }
    }

    const fns = (handlers || []).filter(
      (handler) => typeof handler === 'function',
    );

    this.routes.push({ keys, pattern, fns, method: '', isMiddleware: true });
  }

  lookup(req, res, callback) {
    let matches = [];

    const params = {};

    let handlers = [];

    const sortableRoutes = this.routes.reverse();

    sortableRoutes.sort((a, b) => {
      if (b.isMiddleware) return 0;

      return -1;
    });

    for (let i = 0; i < sortableRoutes.length; i += 1) {
      const { keys, pattern, method, fns } = sortableRoutes[i];

      const { url } = req;

      const methodNotAllowed = method.length !== 0 && method !== req.method;

      if (!keys) {
        matches = pattern.exec(url);

        if (matches && matches.group) {
          for (const key in matches.group) {
            if (Object.prototype.hasOwnProperty.call(key, matches.group)) {
              const value = matches.group[key];

              params[key] = value;
            }
          }
        }

        if (methodNotAllowed) {
          const e = new Error('Method Not Allowed.');

          e.statusCode = 405;

          return callback(e);
        }

        if (fns.length > 1) {
          handlers = handlers.concat(fns);
        } else {
          handlers.push(fns[0]);
        }
      } else if (keys.length > 0) {
        matches = pattern.exec(url);

        if (matches) {
          for (let j = 0; j < keys.length; j += 1) {
            params[keys[j]] = matches[j + 1];
          }
        }

        if (methodNotAllowed) {
          const e = new Error('Method Not Allowed.');

          e.statusCode = 405;

          return callback(e);
        }

        if (fns.length > 1) {
          handlers = handlers.concat(fns);
        } else {
          handlers.push(fns[0]);
        }
      } else if (pattern.test(url)) {
        if (methodNotAllowed) {
          const e = new Error('Method Not Allowed.');

          e.statusCode = 405;

          return callback(e);
        }

        if (fns.length > 1) {
          handlers = handlers.concat(fns);
        } else {
          handlers.push(fns[0]);
        }
      }
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
