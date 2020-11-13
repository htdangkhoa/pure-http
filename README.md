<h1 align='center'>pure-http</h1>

<div align='center'>
  <img src='./art/cover.jpeg' alt='cover' />
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

## Benchmarks

> Please remember that your application code is most likely the slowest part of your application!
> Switching from Express to pure-http will (likely) not guarantee the same performance gains.

- Machine: ubuntu-s-1vcpu-1gb-sgp1-01, x86-64, Ubuntu 18.04.5 LTS, Intel(R) Xeon(R) CPU E5-2650 v4 @ 2.20GHz, 16GB RAM.
- Node: `v12.18.4`
- Run: Fri, 13 Nov 2020 21:07:21

| Framework                  |    Version | Requests/Sec |     Latency |
| -------------------------- | ---------: | :----------: | ----------: |
| **pure-http (with cache)** | **latest** | **\~ 8,792** | **10.92ms** |
| pure-http                  |     latest |   ~ 8,633    |     11.12ms |
| polka                      |      0.5.2 |   ~ 7,364    |     13.03ms |
| express                    |     4.17.1 |   ~ 3,588    |     26.86ms |
| fastify                    |      3.8.0 |   ~ 2,702    |     35.54ms |

See more: [BENCHMARKS](./bench)
