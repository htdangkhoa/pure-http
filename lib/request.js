const { parseUrl } = require('./utils');
const { parse } = require('./cookie');

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

  let cookies;

  try {
    cookies = parse(req.headers.cookie);
  } catch (error) {
    cookies = {};
  }

  req.cookies = cookies;

  req.cookie = parse;

  return req;
};

module.exports = request;
