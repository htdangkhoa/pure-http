/* eslint-disable */
const express = require('polka');
const { one, two } = require('./middlewares');

const app = express();

app.use(one, two);

app.get('/', (req, res) => res.end('Hello'));

app.get('/user/:id', (req, res) => {
  res.end(`User: ${req.params.id}`);
});

app.listen(3000);
