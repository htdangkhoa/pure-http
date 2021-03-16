/* eslint-disable */
const { fastify } = require('fastify');
const register = require('fastify-express');

const { one, two } = require('./middlewares');

const app = fastify();

module.exports = async () => {
  await app.register(register);

  app.use(one, two);

  app.get('/', (req, res) => res.send('Hello'));

  app.get('/user/:id', (req, res) => {
    res.send(`User: ${req.params.id}`);
  });

  return app;
};
