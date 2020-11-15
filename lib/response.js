const { STATUS_CODES } = require('http');

const TYPE = 'content-type';

const CONTENT_LENGTH = 'content-length';

const OCTET_STREAM = 'application/octet-stream';

const APPLICATION_JSON = 'application/json;charset=utf-8';

const TEXT_PLAIN = 'text/plain';

const send = (req, res, cache, data, ...args) => {
  let body = data;

  let status = 200;

  const headers = {};

  const hasStatusCode = typeof args[0] === 'number';

  if (hasStatusCode) {
    status = args[0];
  }

  const tmp = hasStatusCode ? args[1] : args[0];

  for (const key in tmp) {
    if (Object.prototype.hasOwnProperty.call(tmp, key)) {
      const value = tmp[key];

      headers[key] = value;
    }
  }

  let type = headers[TYPE] || res.getHeader(TYPE);

  if (cache) {
    const bodyCached = cache.get(req.originUrl);

    if (JSON.stringify(bodyCached) === JSON.stringify(body)) {
      body = bodyCached;
    } else {
      cache.set(req.originUrl, body);
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

  headers[TYPE] = type || TEXT_PLAIN;

  headers[CONTENT_LENGTH] = Buffer.byteLength(body);

  res.writeHead(status, headers);

  return res.end(body);
};

const json = (req, res, cache, data, ...args) => {
  let body = JSON.stringify(data);

  let status = 200;

  const headers = {};

  const hasStatusCode = typeof args[0] === 'number';

  if (hasStatusCode) {
    status = args[0];
  }

  const tmp = (hasStatusCode ? args[1] : args[0]) || {};

  for (const key in tmp) {
    if (Object.prototype.hasOwnProperty.call(tmp, key)) {
      const value = tmp[key];

      headers[key] = value;
    }
  }

  const bodyCached = cache.get(req.originUrl);

  if (cache) {
    if (bodyCached) {
      body = bodyCached;
    } else {
      cache.set(req.originUrl, body);
    }
  }

  headers[TYPE] = APPLICATION_JSON;

  headers[CONTENT_LENGTH] = Buffer.byteLength(body);

  res.writeHead(status, headers);

  return res.end(body);
};

const redirect = (res, ...args) => {
  let statusCode = 302;

  let address = '/';

  if (typeof args[0] === 'number') {
    statusCode = args[0];

    address = args[1];
  } else {
    statusCode = args[1] || 302;

    address = args[0];
  }

  res.writeHead(statusCode, { Location: address });

  res.end();
};

const response = (req, rawRes, cache) => {
  const res = rawRes;

  res.cache = cache;

  res.header = (name, value) => res.setHeader(name, value);

  res.send = (data, ...args) => send(req, res, cache, data, ...args);

  res.json = (data, ...args) => json(req, res, cache, data, ...args);

  res.redirect = (...args) => redirect(res, ...args);

  return res;
};

module.exports = response;
