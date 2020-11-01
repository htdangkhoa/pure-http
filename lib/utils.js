import methods from './methods';

export const first = (input) => {
  if (typeof input !== 'string' && !Array.isArray(input)) {
    return undefined;
  }

  return [...input].splice(0, 1)[0];
};

export const regexToParams = (str, loose) => {
  if (str instanceof RegExp) return { keys: false, pattern: str };

  let c;

  let o;

  let tmp;

  let ext;

  const keys = [];

  let pattern = '';

  const arr = str.split('/');

  arr[0] || arr.shift();

  while ((tmp = arr.shift())) {
    c = first(tmp);

    if (c === '*') {
      keys.push('wild');
      pattern += '/(.*)';
    } else if (c === ':') {
      o = tmp.indexOf('?', 1);
      ext = tmp.indexOf('.', 1);
      keys.push(tmp.substring(1, ~o ? o : ~ext ? ext : tmp.length));
      pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
      if (~ext) pattern += `${~o ? '?' : ''}\\${tmp.substring(ext)}`;
    } else {
      pattern += `/${tmp}`;
    }
  }

  return {
    keys,
    pattern: new RegExp(`^${pattern}${loose ? '(?=$|/)' : '/?$'}`, 'i'),
  };
};

export const useMiddlewares = (stacks, ...args) => {
  if (typeof args[0] !== 'string' && Array.isArray(args[0])) {
    throw new Error('Middleware must be a function!');
  }

  let path = '/';

  const middlewares = [];

  const handlers = [];

  const hasPath = typeof args[0] === 'string';

  if (hasPath) {
    path = first(args);
  }

  for (let i = hasPath ? 1 : 0; i < args.length; i += 1) {
    const tempMiddleware = args[i];

    middlewares.push(tempMiddleware);
  }

  for (let i = 0; i < middlewares.length; i += 1) {
    const middleware = middlewares[i];

    if (Array.isArray(middleware)) {
      for (let j = 0; j < middleware.length; j += 1) {
        const mid = middleware[j];

        handlers.push(mid);
      }
    } else {
      handlers.push(middleware);
    }
  }

  for (let i = 0; i < handlers.length; i += 1) {
    const handler = handlers[i];

    if (typeof handler !== 'function') {
      throw new Error('Middleware must be a function!');
    }

    stacks.push({ path, handler });
  }
};

export const useRoutes = async (
  routeTable,
  req,
  res,
  callback,
  prefix = '',
) => {
  req.params = {};

  const method = req.method.toLowerCase();

  if (!methods.includes(method)) {
    res.writeHead(405);

    return res.end('Method Not Allowed.');
  }

  let { url } = req;

  const i = url.indexOf('?');

  if (i !== -1) {
    url = url.substring(0, i);
  }

  const route = routeTable[method].find(({ path: regex }) => {
    let path = regex;

    if (prefix) {
      path = prefix + path;
    }

    const j = path.indexOf('/:');

    const valueOfParams = url.substring(j).split('/').filter(Boolean);

    const { keys, pattern } = regexToParams(path);

    const params = keys.reduce((origin, key, index) => {
      const o = origin;

      o[key] = valueOfParams[index];

      return o;
    }, {});

    Object.assign(req.params, params);

    return pattern.test(url);
  });

  if (route) {
    const result = await route.handler(req, res);

    return result;
  }

  if (typeof callback === 'function') {
    return callback(req, res);
  }

  res.writeHead(404);

  return res.end(`Cannot ${method.toUpperCase()} ${req.url}`);
};

export const parseUrl = (url) => {
  const match = url.match(
    /^(https?\\:)\/\/(([^:\\/?#]*)(?:\\:([0-9]+))?)([\\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/,
  );

  const search = match[6];

  const query = search
    .slice(1)
    .split('&')
    .reduce((origin, q) => {
      const [key, value] = q.split('=');

      if (!key) return { ...origin };

      return { ...origin, [key]: decodeURIComponent(value) };
    }, {});

  if (match) {
    return {
      originalUrl: url,
      protocol: match[1].replace(':', ''),
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search,
      query,
      hash: match[7],
    };
  }

  return {};
};
