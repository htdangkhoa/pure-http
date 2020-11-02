const { first, parseUrl } = require('./utils');

const request = (rawReq) => {
  const req = rawReq;

  let protocol = req.connection.encrypted ? 'https' : 'http';

  protocol = req.headers['x-forwarded-proto'] || protocol;

  protocol = first(protocol.split(/\s*,\s*/));

  const url = `${protocol}://${req.headers.host}${req.url}`;

  const URL = parseUrl(url);

  Object.assign(req, URL);

  return req;
};

module.exports = request;
