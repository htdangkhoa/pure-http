/* eslint-disable */
const pureHttp = require('..');

const app = pureHttp();

const router = pureHttp.Router();

router.get('/hello/:name', (req, res) => {
  res.send(`Hello ${req.params.name}!`);
});

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(8080, () => console.log('Server is listening on port 8080...'));
