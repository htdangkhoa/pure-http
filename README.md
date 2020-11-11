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

## Options

- `server`: Allows to optionally override the HTTP server instance to be used

  > Default: `undefined`.

- `onError`: A handler when an error is thrown.

  > Default: `((error, req, res) => res.send(error))`.

- `onNotFound`: A handler when no route definitions were matched.

  > Default: `((req, res) => res.send("Cannot " + req.method + " " + req.url))`.

## Router

```js
const { Router } = require('pure-http');

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello world');
});

/* ... */

const app = require('pure-http');

app.use('/api', router);

app.listen(3000);
```

## Benchmark

Results are taken after 1 warm-up run. The tool used for results is the following:

```bash
$ wrk -t8 -c100 -d30s http://localhost:3000/user/123
```

> Please remember that your application code is most likely the slowest part of your application!
> Switching from Express to pure-http will (likely) not guarantee the same performance gains.

| Framework                  |    Version |  Requests/sec |
| -------------------------- | ---------: | ------------: |
| **pure-http (with cache)** | **latest** | **\~ 39,115** |
| pure-http                  |     latest |      ~ 36,012 |
| polka                      |      0.5.2 |      ~ 35,538 |
| Fastify                    |      3.8.0 |      ~ 17,576 |
| express                    |     4.17.1 |      ~ 15,025 |
