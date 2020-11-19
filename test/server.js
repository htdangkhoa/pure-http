const bodyParser = require('body-parser');
const pureHttp = require('..');
const router = require('./router');

const app = pureHttp({
  cache: pureHttp.Cache({ maxAge: 60000 }),
});

app.use([bodyParser.json(), bodyParser.urlencoded({ extended: true })]);

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.use('/api', router);

app.listen(3000);

module.exports = app;
