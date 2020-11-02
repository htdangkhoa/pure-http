const PureHttp = require('./pure-http');
const methods = require('./methods');
const { useMiddlewares, useRoutes } = require('./utils');

const Router = () => {
  const { stacks, routeTable } = PureHttp.prototype;

  const instance = (req, res, next) => {
    const i = req.url.slice(1).indexOf('/');

    const prefix = req.url.substring(0, i + 1);

    useRoutes(routeTable, req, res, () => next(), prefix);
  };

  for (let i = 0; i < methods.length; i += 1) {
    const method = methods[i];

    if (!routeTable[method]) {
      Object.assign(routeTable, { [method]: [] });
    }

    instance[method] = (path, handler) => {
      routeTable[method].push({ path, handler });
    };
  }

  instance.use = (...middlewares) => useMiddlewares(stacks, ...middlewares);

  return instance;
};

module.exports = Router;
