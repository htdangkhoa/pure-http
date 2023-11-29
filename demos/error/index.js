/* eslint-disable */
const bodyParser = require('body-parser');
const pureHttp = require('../..');

const app = pureHttp();

app.use([bodyParser.json(), bodyParser.urlencoded({ extended: true })]);

app.post('/', (req, res) => {
  res.send(req.body);
});

app.get('/error', (req, res) => {
  throw new Error('New error.');
});

app.get('/test', (req, res) => {
  res.send('Test.');
});

// app.use((req, res, next) => {
//   res.send('Not found.');
// });

app.use((error, req, res, next) => {
  res.send('test.', 500);
});

app.listen(3000, () => console.log('Server is listening on port 3000...'));
