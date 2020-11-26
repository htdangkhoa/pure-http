/* eslint-disable */
const bodyParser = require('body-parser');
const pureHttp = require('../..');
const router = require('./router');

const app = pureHttp();

app.use([bodyParser.json(), bodyParser.urlencoded({ extended: true })]);

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => console.log('Server is listening on port 3000...'));
