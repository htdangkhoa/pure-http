const PureHttp = require('./lib/pure-http');
const Router = require('./lib/router');

const pureHttp = () => new PureHttp();

module.exports = pureHttp;

module.exports.Router = Router;
