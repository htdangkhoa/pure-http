/* eslint-disable */
const { fastify } = require('fastify');
const register = require('fastify-express');

const { one, two } = require('./middlewares');

const app = fastify();

app.register(register).then(() => {
  app.use(one);
  app.use(two);

  app.get('/', (req, res) => res.send('Hello'));

  app.get('/user/:id', (req, res) => {
    res.end(`User: ${req.params.id}`);
  });

  app.listen(3000);
});
