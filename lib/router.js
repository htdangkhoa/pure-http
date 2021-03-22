const { regexToParams } = require('./utils');
const extendMiddleware = require('./extend');

const defer =
  typeof setImmediate === 'function'
    ? setImmediate
    : function (fn) {
        process.nextTick(fn.bind.apply(fn, arguments));
      };

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
    this.connect = this.addRoute.bind(this, 'CONNECT');
    this.all = this.addRoute.bind(this, '');

    this.use = this.addMiddleware.bind(this);
  }

  addRoute(method, route, ...handlers) {
    let path = route;

    if (this.prefix) {
      path = `/${this.prefix}${path}`;
    }

    const { keys, pattern } = regexToParams(path);

    const fns = handlers.filter((handler) => typeof handler === 'function');

    this.routes.push({ keys, pattern, fns, method, path });

    return this;
  }

  addMiddleware() {
    let route = '/';

    let handlers = [];

    const hasPath =
      typeof arguments[0] === 'string' || arguments[0] instanceof RegExp;

    if (hasPath) {
      route = arguments[0];
    }

    if (this.prefix) {
      route = `/${this.prefix}${route}`;
    }

    for (let i = hasPath ? 1 : 0; i < arguments.length; i += 1) {
      const tmp = arguments[i];

      handlers = handlers.concat(tmp);
    }

    handlers.every((handler) => {
      if (typeof handler !== 'function' && !(handler instanceof Router)) {
        throw new Error('Middleware must be a function!');
      }

      return true;
    });

    const routers = handlers.filter((fn) => fn instanceof Router);

    for (let i = 0; i < routers.length; i += 1) {
      const router = routers[i];

      for (let j = 0; j < router.routes.length; j += 1) {
        const { path: childRoute, fns, method } = router.routes[j];

        const path = (route + (childRoute || '')).replace(/\/{1,}/g, '/');

        const { keys: newKeys, pattern: newPattern } = regexToParams(path);

        this.routes.push({
          keys: newKeys,
          pattern: newPattern,
          fns,
          method,
          path,
        });
      }
    }

    const fns = handlers.filter((handler) => typeof handler === 'function');

    const { keys, pattern } = regexToParams(route, true);

    this.routes.push({ keys, pattern, fns, method: '', isMiddleware: true });

    return this;
  }

  lookup(req, res) {
    let matches = [];

    const params = {};

    let handlers = [];

    let i = 0;

    for (; i < this.routes.length; i += 1) {
      const { keys, pattern, method, fns, isMiddleware } = this.routes[i];

      if (
        isMiddleware ||
        method === req.method ||
        method.length === 0 ||
        method === 'HEAD'
      ) {
        const url = req.url.split('?')[0];

        let foundPath = false;

        if (!keys || keys.length > 0) {
          matches = pattern.exec(url);

          if (matches) {
            if (matches.groups) {
              // eslint-disable-next-line guard-for-in
              for (const key in matches.groups) {
                const value = matches.groups[key];

                params[key] = value;
              }
            } else {
              for (let j = 0; j < keys.length; j += 1) {
                params[keys[j]] = matches[j + 1];
              }
            }

            foundPath = true;
          }
        } else if (pattern.test(url)) {
          foundPath = true;
        }

        if (foundPath) {
          handlers = handlers.concat(fns);
        }
      }
    }

    req.originalUrl = req.originalUrl || req.url;
    req.params = params;
    handlers.unshift(extendMiddleware(params));

    let id = 0;

    function next(error) {
      const fn = handlers[id];

      id += 1;

      return defer(() => {
        if (error) {
          if (typeof fn === 'function' && fn.length === 4)
            return fn(error, req, res, next);

          return res.send(error.stack, error.status || 500);
        }

        if (typeof fn !== 'function') {
          return res.send(`Cannot ${req.method} ${req.url}`, 404);
        }

        try {
          if (fn.length === 4) {
            return res.send(`Cannot ${req.method} ${req.url}`, 404);
          }

          return fn(req, res, next);
        } catch (e) {
          return next(e);
        }
      });
    }

    return next();
  }
}

module.exports = Router;
