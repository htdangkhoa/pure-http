/* eslint-disable */
const { App } = require('@tinyhttp/app');
const { one, two } = require('./middlewares');

const app = new App();

app.use(one, two);

app.get('/', (req, res) => res.send('Hello'));

app.get('/user/:id', (req, res) => {
  res.send(`User: ${req.params.id}`);
});

module.exports = () => app;
