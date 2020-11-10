const { STATUS_CODES } = require('http');

const TYPE = 'content-type';

const CONTENT_LENGTH = 'content-length';

const OCTET_STREAM = 'application/octet-stream';

const APPLICATION_JSON = 'application/json;charset=utf-8';

const send = (res, data, ...args) => {
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

  headers[TYPE] = type || 'text/plain';

  headers[CONTENT_LENGTH] = Buffer.byteLength(body);

  res.writeHead(status, headers);

  return res.end(body);
};

const json = (res, data, ...args) => {
  const body = JSON.stringify(data);

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

const response = (rawRes) => {
  const res = rawRes;

  res.header = (name, value) => res.setHeader(name, value);

  res.send = (data, ...args) => send(res, data, ...args);

  res.json = (data, ...args) => json(res, data, ...args);

  res.redirect = (...args) => redirect(res, ...args);

  return res;
};

module.exports = response;
