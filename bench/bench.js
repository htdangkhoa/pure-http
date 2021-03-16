/* eslint-disable */
const wrk = require('wrk');

const express = require('./express');
const fastify = require('./fastify');
const pureHttp = require('./pure-http');
const pureHttpWithCache = require('./pure-http-with-cache');
const tinyhttp = require('./tinyhttp');

const frameworks = [
  {
    name: 'express',
    fn: express,
  },
  {
    name: 'fastify',
    fn: fastify,
  },
  {
    name: 'pure-http',
    fn: pureHttp,
  },
  {
    name: 'pure-http (with cache)',
    fn: pureHttpWithCache,
  },
  {
    name: 'tinyhttp',
    fn: tinyhttp,
  },
];

const results = [];

const bench = (options) => {
  const { port, ...wrkOptions } = options;

  wrkOptions.url = `http://localhost:${port}/user/123`;

  return frameworks.reduce(async (previous, { name, fn }) => {
    return previous.then(async () => {
      const framework = await fn();

      const handle = () =>
        new Promise(async (resolve, reject) => {
          const server = await framework.listen(port);

          console.log(`Benchmarking ${name}...`);

          return wrk(
            wrkOptions,
            async (error, { requestsTotal, requestsPerSec, latencyAvg }) => {
              if (error) return reject(error);

              if (framework.close) {
                await framework.close();
              } else if (framework.server && framework.server.close) {
                await framework.server.close();
              } else {
                await server.close();
              }

              console.log('✨ Done.');

              return resolve({
                framework: name,
                requestsTotal,
                requestsPerSec,
                latencyAvg,
              });
            },
          );
        });

      return handle().then((result) => results.push(result));
    });
  }, Promise.resolve());
};

module.exports = (options) =>
  bench(options)
    .then(() => results)
    .catch((error) => {
      console.error(error);

      process.exit(1);
    });
