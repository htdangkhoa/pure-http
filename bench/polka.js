/* eslint-disable */
const polka = require('polka');
const send = require('@polka/send-type');
const { one, two } = require('./middlewares');

const app = polka();

app.use(one, two);

app.get('/', (req, res) => send(res, 200, 'Hello'));

app.get('/user/:id', (req, res) => {
  send(res, 200, `User: ${req.params.id}`);
});

module.exports = () => app;
