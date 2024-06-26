const { ServerResponse, STATUS_CODES } = require('http');
const fs = require('fs');

const Cache = require('../cache');
const { serialize, sign } = require('../cookie');
const { getMimeType } = require('../mime');
const { defineProperty } = require('../utils');
const etag = require('../etag');

const TYPE = 'Content-Type';

const CONTENT_LENGTH = 'Content-Length';

const X_CONTENT_TYPE_OPTIONS = 'X-Content-Type-Options';

const OCTET_STREAM = 'application/octet-stream';

const APPLICATION_JSON = 'application/json; charset=utf-8';

const TEXT_PLAIN = 'text/plain; charset=utf-8';

const TEXT_JAVASCRIPT = 'text/javascript; charset=utf-8';

const TEXT_HTML = 'text/html; charset=utf-8';

const NOSNIFF = 'nosniff';

const SET_COOKIE = 'Set-Cookie';

const ETAG = 'ETag';

const res = Object.create(ServerResponse.prototype);

function handleSendArguments() {
  let cached = false;

  let statusCode = this.statusCode;

  const headers = this.getHeaders();

  for (let i = 1; i < arguments.length; i += 1) {
    const arg = arguments[i];

    const type = typeof arg;

    if (type === 'number') {
      statusCode = arg;
    } else if (type === 'object') {
      // eslint-disable-next-line guard-for-in
      for (const key in arg) {
        const value = arg[key];

        headers[key] = value;
      }
    } else if (type === 'boolean') {
      cached = arg;
    }
  }

  return { statusCode, headers, cached };
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
        default:
          return '\\u0026';
      }
    });
  }

  return json;
}

const originalWriteHead = res.writeHead;

res.writeHead = function () {
  if (this.$cookies instanceof Set) {
    const cookies = Array.from(this.$cookies);
    this.setHeader(SET_COOKIE, cookies.filter(Boolean));
  }

  this.$cookies = undefined;

  return originalWriteHead.apply(this, arguments);
};

res.status = function (code) {
  this.statusCode = code;

  return this;
};

res.header = function (name, value) {
  this.setHeader(name, value);

  return this;
};

res.cookie = function (name, value, options) {
  const opts = Object.create({});
  Object.assign(opts, options);

  const secret = this.request.secret;
  const signed = opts.signed;

  if (signed && !secret) {
    throw new Error('cookieParser("secret") required for signed cookies');
  }

  if (!(this.$cookies instanceof Set)) {
    defineProperty(this, '$cookies', new Set());
  }

  let val =
    typeof value === 'object' ? `j:${JSON.stringify(value)}` : String(value);

  if (signed) {
    val = `s:${sign(val, secret)}`;
  }

  if (typeof opts.maxAge === 'number') {
    opts.expires = new Date(Date.now() + opts.maxAge);
    opts.maxAge /= 1000;
  }

  this.$cookies.add(serialize(name, val, opts));

  return this;
};

res.clearCookie = function (name, options) {
  const opts = options || {};

  Object.assign(opts, { expires: new Date(1), path: '/' });

  return this.cookie(name, '', opts);
};

res.redirect = function (url) {
  let address = url;

  let statusCode = 302;

  if (arguments.length === 2) {
    if (typeof arguments[0] === 'number') {
      statusCode = arguments[0];
      address = arguments[1];
    } else {
      statusCode = arguments[1];
    }
  }

  this.statusCode = statusCode;

  this.writeHead(statusCode, { Location: address });

  this.end();
};

res.send = function (data) {
  if (this.request.method === 'HEAD') {
    return this.end('');
  }

  const { cache } = this.request.app;

  let body = data;

  // eslint-disable-next-line prefer-const
  let { statusCode, headers, cached } = handleSendArguments.apply(
    this,
    arguments,
  );

  const availableCache = cached && cache instanceof Cache;

  const bodyAsString = JSON.stringify(body);

  if (availableCache) {
    const cachedData = cache.get(this.request.originalUrl);

    if (
      cachedData &&
      this.request.method.includes(cachedData.method) &&
      cachedData.raw === bodyAsString
    ) {
      return this.send(body, cachedData.statusCode, cachedData.headers, false);
    }
  }

  let contentType =
    headers[TYPE] ||
    this.getHeader(TYPE) ||
    headers[TYPE.toLowerCase()] ||
    this.getHeader(TYPE.toLowerCase());

  // Cast body type.
  if (body && typeof body.pipe === 'function') {
    headers[TYPE] = contentType || OCTET_STREAM;

    this.writeHead(statusCode, headers);

    return body.pipe(this);
  }

  if (body instanceof Buffer) {
    contentType = contentType || OCTET_STREAM;
  } else if (
    (typeof body === 'object' || typeof body === 'boolean') &&
    body !== null
  ) {
    body = JSON.stringify(body);
    contentType = contentType || APPLICATION_JSON;
  } else if (typeof body === 'number') {
    statusCode = body;
    body = STATUS_CODES[body] || String(body);
  } else {
    body = body || '';
  }

  const tag = this.getHeader(ETAG) || etag(body, 'utf8');

  if (body && !!tag) {
    headers[ETAG] = tag;
  }

  headers[TYPE] = contentType || TEXT_PLAIN;

  headers[CONTENT_LENGTH] = Buffer.byteLength(body);

  if (availableCache) {
    cache.set(this.request.originalUrl, {
      method: this.request.method,
      raw: bodyAsString,
      headers,
      statusCode,
    });
  }

  this.statusCode = statusCode;

  this.writeHead(statusCode, headers);

  return this.end(body);
};

res.json = function (data) {
  const body = JSON.parse(JSON.stringify(data));

  const { cached, statusCode, headers } = handleSendArguments.apply(
    this,
    arguments,
  );

  return this.send(body, cached, statusCode, headers);
};

res.jsonp = function (data) {
  const val = data;

  let cached = true;

  const opts = {};

  if (arguments.length > 1) {
    if (typeof arguments[1] === 'boolean') {
      cached = arguments[1];

      Object.assign(opts, arguments[2]);
    } else {
      cached = arguments[2];

      Object.assign(opts, arguments[1]);
    }
  }

  const { escape, replacer, spaces, callbackName = 'callback' } = opts;

  let body = stringify(val, replacer, spaces, escape);

  let callback = this.request.query[callbackName];

  if (!this.getHeader(TYPE) && !this.getHeader(TYPE.toLowerCase())) {
    this.setHeader(X_CONTENT_TYPE_OPTIONS, NOSNIFF);
    this.setHeader(TYPE, APPLICATION_JSON);
  }

  if (typeof callback === 'string' && callback.length !== 0) {
    this.setHeader(X_CONTENT_TYPE_OPTIONS, NOSNIFF);
    this.setHeader(TYPE, TEXT_JAVASCRIPT);

    callback = callback.replace(/[^[\]\w$.]/g, '');

    body = body.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

    body = `/**/ typeof ${callback} === 'function' && ${callback}(${body});`;
  }

  return this.send(body, cached);
};

res.sendFile = function (filePath, options) {
  const opts = {};
  Object.assign(opts, options);

  const { headers } = opts;

  const readStream = fs.createReadStream(filePath);

  const mimeType = getMimeType(filePath);
  this.setHeader(TYPE, `${mimeType}; charset=utf-8`);

  const stat = fs.statSync(filePath);
  this.setHeader(CONTENT_LENGTH, stat.size);

  const tag = this.getHeader(ETAG) || etag(stat, 'utf8');

  this.setHeader(ETAG, tag);

  if (typeof headers === 'object') {
    // eslint-disable-next-line guard-for-in
    for (const key in headers) {
      const value = headers[key];

      this.setHeader(key, value);
    }
  }

  return readStream.pipe(this);
};

res.render = function (filename, options, callback) {
  const self = this;
  const { views } = self.request.app;

  const viewsOption = {};
  Object.assign(viewsOption, views);

  const { dir, ext, engine } = viewsOption;

  if (typeof dir !== 'string') throw new Error('dir must be a string.');

  if (typeof ext !== 'string') throw new Error('ext must be a string.');

  if (typeof engine !== 'function')
    throw new Error('engine must be a function.');

  let done = callback;

  let opts = {};
  Object.assign(opts, options);

  if (typeof options === 'function') {
    done = options;

    opts = {};
  }

  const pathView = `${dir}/${filename}.${ext.replace(/\./g, '')}`;

  done =
    done ||
    function defaultDone(error, out) {
      if (error) throw error;

      return self.send(out, { [TYPE]: TEXT_HTML });
    };

  return engine(pathView, opts, done);
};

module.exports = res;
