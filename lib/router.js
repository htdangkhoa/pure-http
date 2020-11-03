const PureHttp = require('./pure-http');
const { useMethods, useRoutes, useMiddlewares } = require('./utils');

const Router = () => {
  const { stacks, routeTable } = PureHttp.prototype;

  const instance = (req, res, next) => {
    const i = req.url.slice(1).indexOf('/');

    const prefix = req.url.substring(0, i + 1);

    useRoutes(routeTable, req, res, () => next(), prefix);
  };

  useMethods(routeTable, instance);

  instance.use = (...middlewares) => useMiddlewares(stacks, ...middlewares);

  return instance;
};

module.exports = Router;
