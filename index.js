const pureHttp = require('./lib/pure-http');
const Router = require('./lib/router');

function router(prefix) {
  return new Router({ isChild: true, prefix });
}

pureHttp.Router = router;

module.exports = pureHttp;
