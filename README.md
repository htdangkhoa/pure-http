<h1 align='center'>pure-http</h1>

<div align='center'>
  <img src='https://raw.githubusercontent.com/htdangkhoa/pure-http/master/art/cover.jpeg' alt='cover' />
</div>

## Installation

```bash
$ npm install --save pure-http
```

## Usage

```js
const pureHttp = require('pure-http');

const app = pureHttp();

app.get('/', (req, res) => {
  res.send('Hello world);
});
```
