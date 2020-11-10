<h1 align='center'>pure-http</h1>

<div align='center'>
  <img src='https://raw.githubusercontent.com/htdangkhoa/pure-http/master/art/cover.jpeg' alt='cover' />
</div>

## Installation

```bash
$ npm install --save pure-http
```

## Usage

Basic server:

```js
const pureHttp = require('pure-http');

const app = pureHttp();

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(3000);
```

Exist server:

```js
const http = require('http');
const pureHttp = require('pure-http');

const server = http.createServer();

const app = pureHttp({ server });

app.listen(3000);
```

Secure server:

```js
const https = require('https');
const pureHttp = require('pure-http');

const server = https.createServer({
  key: ...,
  cert: ...,
});

const app = pureHttp({ server });

app.listen(3000);
```

## Options:

- `server`: Allows to optionally override the HTTP server instance to be used

  > Default: `undefined`.

- `onError`: A handler when an error is thrown.

  > Default: `((error, req, res) => res.send(error))`.

- `onNotFound`: A handler when no route definitions were matched.

  > Default: `((req, res) => res.send("Cannot " + req.method + " " + req.url))`.
