/* eslint-disable */
const pureHttp = require('..');

const app = pureHttp();

app.get('/', (req, res) => {
  res.send(req.headers);
});

app.get('/redirect', (req, res) => {
  res.redirect('/');
});

app.listen(3000, () => console.log('Server is listening on port 3000...'));
