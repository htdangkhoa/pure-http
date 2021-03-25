<h1 align='center'>pure-http</h1>

<p align='center'>Bring the middleware and router to native http.</p>

<p align='center'>
  <a href='https://depfu.com/github/htdangkhoa/pure-http?project_id=17737'>
    <img src='https://badges.depfu.com/badges/22cfff5ebd5901cb72e115e69767cad5/count.svg' alt='depfu' />
  </a>

  <a href='https://www.npmjs.com/package/pure-http'>
    <img src='https://img.shields.io/npm/v/pure-http' alt='npm' />
  </a>

  <a href="https://bundlephobia.com/result?p=pure-http">
    <img src="https://badgen.net/bundlephobia/minzip/pure-http" alt="bundle size" />
  </a>

  <a href="https://www.codefactor.io/repository/github/htdangkhoa/pure-http">
    <img src="https://www.codefactor.io/repository/github/htdangkhoa/pure-http/badge" alt="codefactor" />
  </a>

  <a href='https://github.com/htdangkhoa/pure-http/actions/workflows/build.yml'>
    <img src='https://github.com/htdangkhoa/pure-http/actions/workflows/build.yml/badge.svg' alt='build' />
  </a>

  <a href='https://coveralls.io/github/htdangkhoa/pure-http?branch=develop'>
    <img src='https://coveralls.io/repos/github/htdangkhoa/pure-http/badge.svg?branch=develop' alt='coverage status' />
  </a>

  <a href='https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base'>
    <img src='https://img.shields.io/badge/eslint-airbnb-4B32C3.svg' alt='eslint: airbnb' />
  </a>

  <a href='https://github.com/prettier/prettier'>
    <img src='https://img.shields.io/badge/code_style-prettier-ff69b4.svg' alt='code style: prettier' />
  </a>
</p>

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

## Application Options:

- `server`: Allows to optionally override the HTTP server instance to be used.

  > Default: `undefined`.

- `onError`: A handler when an error is thrown (Deprecated: It has been removed from `3.0.0`).

  > Default: `((error, req, res) => res.send(error))`.

- `onNotFound`: A handler when no route definitions were matched (Deprecated: It has been removed from `3.0.0`).

  > Default: `((req, res) => res.send("Cannot " + req.method + " " + req.url))`.

- `views`: An object to configuration [render](./API.md#resrenderview--options--callback) function.

  > Default: `undefined`.

  - `dir`: A directory for the application's views.

  - `ext`: The default engine extension to use when omitted.

  - `engine`: Registers the given template engine.

- Router Options:

  - `prefix`: Allow append the path before each route.

    > Default: `undefined`.

## Router

```js
const { Router } = require('pure-http');

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello world');
});

/* ... */

const pureHttp = require('pure-http');

const app = pureHttp();

app.use('/api', router);

app.listen(3000);
```

## API References

You can read more at [API.md](./API.md).

## Benchmarks

> Please remember that your application code is most likely the slowest part of your application!
> Switching from Express to pure-http will (likely) not guarantee the same performance gains.

- **Machine:** Ubuntu-s-1vcpu-1gb-sgp1-01, x86-64, Ubuntu 18.04.5 LTS, Intel(R) Xeon(R) CPU E5-2650 v4 @ 2.20GHz, 16GB RAM.
- **Node:** `v12.18.4`
- **Run:** Tue, 16 Mar 2021 16:09:01

| Framework                  |    Version | Requests/Sec |     Latency |
| -------------------------- | ---------: | :----------: | ----------: |
| **pure-http (with cache)** | **latest** | **\~ 6,349** | **15.11ms** |
| pure-http                  |     latest |   ~ 6,255    |     15.39ms |
| tinyhttp                   |     1.2.17 |   ~ 4,942    |     19.44ms |
| fastify                    |     3.14.0 |   ~ 3,310    |     29.10ms |
| express                    |     4.17.1 |   ~ 2,188    |     43.87ms |

- **Machine:** Ubuntu-s-1vcpu-1gb-sgp1-01, x86-64, Ubuntu 18.04.5 LTS, Intel(R) Xeon(R) CPU E5-2650 v4 @ 2.20GHz, 16GB RAM.
- **Node:** `v12.18.4`
- **Run:** Fri, 13 Nov 2020 21:07:21

| Framework                  |   Version | Requests/Sec |     Latency |
| -------------------------- | --------: | :----------: | ----------: |
| **pure-http (with cache)** | **2.x.x** | **\~ 8,792** | **10.92ms** |
| pure-http                  |     2.x.x |   ~ 8,633    |     11.12ms |
| polka                      |     0.5.2 |   ~ 7,364    |     13.03ms |
| express                    |    4.17.1 |   ~ 3,588    |     26.86ms |
| fastify                    |     3.8.0 |   ~ 2,702    |     35.54ms |

See more: [BENCHMARKS](./bench)

## License

The code in this project is released under the [MIT License](./LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhtdangkhoa%2Fpure-http.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhtdangkhoa%2Fpure-http?ref=badge_large)
