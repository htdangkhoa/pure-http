const pureHttp = require('./lib/pure-http');
const Router = require('./lib/router');
const Cache = require('./lib/cache');

function router(prefix) {
  return new Router({ isChild: true, prefix });
}

function cache(options) {
  return new Cache(options);
}

pureHttp.Router = router;

pureHttp.Cache = cache;

module.exports = pureHttp;
