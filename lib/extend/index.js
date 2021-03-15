const { getRequestHeader } = require('./request');
const {
  writeHead,
  status,
  header,
  cookie,
  clearCookie,
  redirect,
  send,
  json,
  jsonp,
  sendFile,
  render,
} = require('./response');
const { parseUrl, merge, defineProperty } = require('../utils');

const extendMiddleware = (params) => (req, res, next) => {
  // request
  req.header = getRequestHeader.bind(req);
  req.originalUrl = req.originalUrl || req.url;
  req.params = params;

  let protocol = req.connection.encrypted ? 'https' : 'http';
  protocol = req.headers['x-forwarded-proto'] || protocol;
  protocol = protocol.split(/\s*,\s*/)[0];

  const url = `${protocol}://${req.headers.host}${req.url}`;
  const networkExtension = parseUrl(url);

  merge(req, networkExtension);

  // response
  defineProperty(res, 'request', req);
  res.writeHead = writeHead.bind(res, res.writeHead);
  res.status = status.bind(res);
  res.header = header.bind(res);
  res.cookie = cookie.bind(res);
  res.clearCookie = clearCookie.bind(res);
  res.redirect = redirect.bind(res);
  res.send = send.bind(res);
  res.json = json.bind(res);
  res.jsonp = jsonp.bind(res);
  res.sendFile = sendFile.bind(res);
  res.render = render.bind(res);

  return next();
};

module.exports = extendMiddleware;
