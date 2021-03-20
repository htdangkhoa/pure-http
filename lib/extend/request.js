const { IncomingMessage } = require('http');

const { defineGetter } = require('../utils');

const req = Object.create(IncomingMessage.prototype);

const URL_PATTERN = /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)/;

const getFullUrl = function () {
  return `${this.protocol}://${this.headers.host}${this.url}`;
};

defineGetter(req, 'protocol', function () {
  let protocol = this.connection.encrypted ? 'https' : 'http';
  protocol = this.headers['x-forwarded-proto'] || protocol;
  protocol = protocol.split(/\s*,\s*/)[0];

  return protocol;
});

defineGetter(req, 'secure', function () {
  return this.protocol === 'https';
});

defineGetter(req, 'hostname', function () {
  const match = getFullUrl.apply(this).match(URL_PATTERN);

  return !match ? undefined : match[3];
});

defineGetter(req, 'host', function () {
  return this.hostname;
});

defineGetter(req, 'port', function () {
  const match = getFullUrl.apply(this).match(URL_PATTERN);

  return parseInt(match[4] || this.secure ? 443 : 80, 10);
});

defineGetter(req, 'path', function () {
  const match = getFullUrl.apply(this).match(URL_PATTERN);

  return match[5];
});

defineGetter(req, 'query', function () {
  const match = getFullUrl.apply(this).match(URL_PATTERN);

  const query = match[6]
    .slice(1)
    .split('&')
    .reduce((origin, q) => {
      const [key, value] = q.split('=');

      const data = origin;

      if (key) {
        Object.assign(data, { [key]: decodeURIComponent(value) });
      }

      return data;
    }, {});

  return query;
});

req.header = function (name) {
  return this.headers[name];
};

module.exports = req;
