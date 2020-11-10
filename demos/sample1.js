/* eslint-disable */
const pureHttp = require('..');

const app = pureHttp();

app.get('/', (req, res) => {
  res.send(req.headers);
});

app.listen(8080, () => console.log('Server is listening on port 8080...'));
