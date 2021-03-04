const { regexToParams } = require('./utils');

class Router {
  constructor(options) {
    const { prefix } = options || {};

    this.prefix = prefix && prefix.replace(/\//g, '');

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
    let path = route;

    if (this.prefix) {
      path = `/${this.prefix}${path}`;
    }

    const { keys, pattern } = regexToParams(path);

    const fns = (handlers || []).filter(
      (handler) => typeof handler === 'function',
    );

    this.routes.push({ keys, pattern, fns, method, path });

    return this;
  }

  addMiddleware(...args) {
    let route = '/';

    const handlers = [];

    const hasPath = typeof args[0] === 'string';

    if (hasPath) {
      route = args[0];
    }

    if (this.prefix) {
      route = `/${this.prefix}${route}`;
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

    const routers = (handlers || []).filter((fn) => fn instanceof Router);

    for (let i = 0; i < routers.length; i += 1) {
      const router = routers[i];

      for (let j = 0; j < router.routes.length; j += 1) {
        const { path: childRoute, fns, method } = router.routes[j];

        const path = (route + (childRoute || '')).replace(/\/{1,}/g, '/');

        const { keys: newKey, pattern: newPattern } = regexToParams(path);

        this.routes.push({
          keys: newKey,
          pattern: newPattern,
          fns,
          method,
          path,
        });
      }
    }

    const fns = (handlers || []).filter(
      (handler) => typeof handler === 'function',
    );

    this.routes.push({ keys, pattern, fns, method: '', isMiddleware: true });

    return this;
  }

  lookup(req, res) {
    let matches = [];

    const params = {};

    let handlers = [];

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
        if (isMiddleware || method === req.method || method === '') {
          handlers = handlers.concat(fns || []);
        }
      }
    }

    req.params = params;

    let id = -1;

    function next() {
      id += 1;

      const fn = handlers[id];

      return setImmediate(() => {
        if (typeof fn !== 'function') {
          return res.send(`Cannot ${req.method} ${req.url}`, 404);
        }

        const fnLength = fn.length;

        try {
          if (fnLength === 3) {
            return fn(req, res, next);
          }

          return fn(req, res);
        } catch (error) {
          const errorHandler = handlers[handlers.length - 1];

          if (errorHandler.length === 4) {
            return errorHandler(error, req, res, next);
          }

          let statusCode = 500;

          let message = 'Internal Server Error.';

          return res.send(
            `Internal Server Error.\n\n${error.stack || error.chainedError}`,
            500,
          );
        }
      });
    }

    return next();
  }
}

module.exports = Router;
