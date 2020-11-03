const PureHttp = require('./lib/pure-http');
const Router = require('./lib/router');

const pureHttp = (options) => new PureHttp(options);

module.exports = pureHttp;

module.exports.Router = Router;
