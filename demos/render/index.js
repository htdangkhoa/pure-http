/* eslint-disable */
const path = require('path');
const fs = require('fs');
const sirv = require('serve-static');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');

const pureHttp = require('../..');

const viewsPath = path.resolve(process.cwd(), 'demos/render/views');

const app = pureHttp({
  view: {
    dir: viewsPath,
    extension: 'html',
    engine: consolidate.swig,
  },
});

app.use('/', sirv(path.resolve(process.cwd(), 'demos/render/public')));

app.use([bodyParser.json(), bodyParser.urlencoded({ extended: true })]);

app.get('/', (req, res) => {
  res.render('index', { data: 'Hello World!' });
});

app.listen(3000, () => console.log('Server is listening on port 3000...'));
