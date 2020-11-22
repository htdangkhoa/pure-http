const { parseUrl } = require('./utils');

const request = (rawReq) => {
  const req = rawReq;

  req.originalUrl = rawReq.url;

  let protocol = req.connection.encrypted ? 'https' : 'http';

  protocol = req.headers['x-forwarded-proto'] || protocol;

  protocol = protocol.split(/\s*,\s*/)[0];

  const url = `${protocol}://${req.headers.host}${req.url}`;

  const URL = parseUrl(url);

  Object.assign(req, URL);

  req.header = (name) => req.headers[name];

  return req;
};

module.exports = request;
