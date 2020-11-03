const { createServer } = require('http');
const pureHttp = require('..');

const app = pureHttp({
  server: createServer(() => console.log('Existed server.')),
});

app.get('/', (req, res) => {
  res.send(req.headers);
});

app.listen(8080, () => console.log('#####'));
