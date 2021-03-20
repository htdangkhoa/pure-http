const request = require('./request');
const response = require('./response');

const { defineGetter } = require('../utils');

const extendMiddleware = () => (req, res, next) => {
  // request
  Object.setPrototypeOf(req, request);

  // response
  defineGetter(res, 'request', function () {
    return req;
  });
  Object.setPrototypeOf(res, response);

  return next();
};

module.exports = extendMiddleware;
