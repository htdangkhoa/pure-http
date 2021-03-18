const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pureHttp = require('../..');

const app = pureHttp();

app.use([
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  cookieParser(),
  timeout('3s'),
]);

app.all(/^[/]foo[/](?<title>\w+)[/]?$/, (req, res) => res.send('pong'));

app.all('/movies/:title.(mp4|mov)', (req, res) => res.send(req.params));

module.exports = app;
