const { STATUS_CODES } = require('http');
const { serialize } = require('./cookie');

const TYPE = 'content-type';

const CONTENT_LENGTH = 'content-length';

const X_CONTENT_TYPE_OPTIONS = 'X-Content-Type-Options';

const OCTET_STREAM = 'application/octet-stream';

const APPLICATION_JSON = 'application/json;charset=utf-8';

const TEXT_PLAIN = 'text/plain';

const TEXT_JAVASCRIPT = 'text/javascript';

const TEXT_HTML = 'text/html;charset=utf-8';

const NOSNIFF = 'nosniff';

const SET_COOKIE = 'Set-Cookie';

function parseOptions(res, ...args) {
  let cached = true;

  let status = res.statusCode || 200;

  const headers = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (typeof arg === 'number') {
      status = arg;
    } else if (typeof arg === 'boolean') {
      cached = arg;
    } else {
      for (const key in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, key)) {
          const value = arg[key];

          headers[key] = value;
        }
      }
    }
  }

  const type = headers[TYPE] || res.getHeader(TYPE);

  return { cached, status, headers, type };
}

function setCookie(res) {
  if (Array.isArray(res.$cookies)) {
    res.headers[SET_COOKIE] = res.$cookies.filter(Boolean).join('; ');
  }

  res.$cookies = undefined;
}

function setStatus(res, code) {
  res.statusCode = code;

  return res;
}

function send(req, res, cache, isJSONP, data, ...args) {
  let body = data;

  const { cached, status, headers, type: contentType } = parseOptions(
    res,
    ...args,
  );

  let type = contentType;

  if (cache && cached) {
    const bodyCached = cache.get(req.originalUrl);

    if (JSON.stringify(bodyCached) === JSON.stringify(body)) {
      body = bodyCached;
    } else {
      cache.set(req.originalUrl, body);
    }
  }

  if (body && typeof body.pipe === 'function') {
    headers[TYPE] = type || OCTET_STREAM;

    res.writeHead(status, headers);

    return body.pipe(res);
  }

  if (body instanceof Buffer) {
    type = type || OCTET_STREAM;
  } else if (typeof body === 'object') {
    body = JSON.stringify(body);

    type = type || APPLICATION_JSON;
  } else {
    body = body || STATUS_CODES[status];
  }

  headers[TYPE] = isJSONP ? TEXT_JAVASCRIPT : type || TEXT_PLAIN;

  headers[CONTENT_LENGTH] = Buffer.byteLength(body);

  setCookie(res);

  res.writeHead(status, headers);

  return res.end(body);
}

function stringify(value, replacer, spaces, escape) {
  let json =
    replacer || spaces
      ? JSON.stringify(value, replacer, spaces)
      : JSON.stringify(value);

  if (escape) {
    json = json.replace(/[<>&]/g, (c) => {
      switch (c.charCodeAt(0)) {
        case 0x3c:
          return '\\u003c';
        case 0x3e:
          return '\\u003e';
        case 0x26:
          return '\\u0026';
        default:
          return c;
      }
    });
  }

  return json;
}

function jsonp(req, res, cache, data, ...args) {
  const val = data;

  let cached = true;

  let opts = {};

  if (typeof args[0] === 'boolean') {
    cached = args[0];

    opts = args[1] || {};
  } else {
    cached = args[1];

    opts = args[0] || {};
  }

  const { escape, replacer, spaces, callbackName = 'callback' } = opts;

  let body = stringify(val, replacer, spaces, escape);

  let callback = req.query[callbackName];

  if (!res.getHeader(TYPE)) {
    res.setHeader(X_CONTENT_TYPE_OPTIONS, NOSNIFF);
    res.setHeader(TYPE, APPLICATION_JSON);
  }

  if (typeof callback === 'string' && callback.length !== 0) {
    res.setHeader(X_CONTENT_TYPE_OPTIONS, NOSNIFF);
    res.setHeader(TYPE, TEXT_JAVASCRIPT);

    callback = callback.replace(/[^[\]\w$.]/g, '');

    body = body.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

    body = `/**/ typeof ${callback} === 'function' && ${callback}(${body});`;
  }

  return send(req, res, cache, body, true, cached);
}

function redirect(res, ...args) {
  let statusCode = 302;

  let address = '/';

  if (typeof args[0] === 'number') {
    statusCode = args[0];

    address = args[1];
  } else {
    statusCode = args[1] || 302;

    address = args[0];
  }

  res.statusCode = statusCode;

  setCookie(res);

  res.writeHead(statusCode, { Location: address });

  res.end();
}

function render(req, res, viewsOptions, filename, options, callback) {
  const { appCallback, dir, ext, engine } = viewsOptions;

  if (typeof dir !== 'string')
    return appCallback(req, res, new Error('dir must be a string.'));

  if (typeof ext !== 'string')
    return appCallback(req, res, new Error('ext must be a string.'));

  if (typeof engine !== 'function')
    return appCallback(req, res, new Error('engine must be a function.'));

  let done = callback;

  let opts = options || {};

  if (typeof options === 'function') {
    done = options;

    opts = {};
  }

  const pathView = `${dir}/${filename}.${ext.replace(/\./g, '')}`;

  done =
    done ||
    function defaultDone(error, out) {
      if (error) return appCallback(req, res, error);

      return res.send(out, { [TYPE]: TEXT_HTML });
    };

  return engine(pathView, opts, done);
}

function cookie(res, name, value, options) {
  const cookies = Array.isArray(res.$cookies) ? res.$cookies : [];

  cookies.push(serialize(name, value, options));

  res.$cookies = cookies;

  return res;
}

function response(req, rawRes, options, appCallback) {
  const res = rawRes;

  res.statusCode = 200;

  const { views, cache } = options || {};

  const viewsOptions = views || {};

  Object.assign(viewsOptions, { appCallback });

  res.cache = cache;

  res.header = (name, value) => {
    res.setHeader(name, value);

    return res;
  };

  res.status = setStatus.bind(this, res);

  res.send = send.bind(this, req, res, cache, false);

  res.json = (data, ...args) =>
    res.send(JSON.parse(JSON.stringify(data)), ...args);

  res.jsonp = jsonp.bind(this, req, res, cache);

  res.redirect = redirect.bind(this, res);

  res.render = render.bind(this, req, res, viewsOptions);

  res.cookie = cookie.bind(this, res);

  return res;
}

module.exports = response;
