#!/usr/bin/env node

/* eslint-disable */
const { cpus } = require('os');
const commander = require('commander');
const bench = require('./bench');

commander
  .option('-p, --port <num>', `port's server (default: 3000)`, parseInt)
  .option(
    '-c, --connections <num>',
    'total number of HTTP connections to keep open with\neach thread handling N = connections/threads (default: 100)',
    parseInt,
  )
  .option(
    '-d, --duration <value>',
    'duration of the test, e.g. 2s, 2m, 2h',
    '30s',
  )
  .option(
    '-t, --threads <num>',
    'total number of threads to use (default: 8)',
    parseInt,
  )
  .parse(process.argv);

bench({
  port: commander.port || 3000,
  connections: commander.connections || 100,
  duration: commander.duration || '30s',
  threads: commander.threads || 8,
}).then((results) => {
  const r = results
    .sort(({ latencyAvg: a }, { latencyAvg: b }) => {
      const latenA = parseFloat(a.replace('ms', ''));

      const latenB = parseFloat(b.replace('ms', ''));

      return latenA === latenB ? 0 : latenA > latenB ? 1 : -1;
    })
    .reduce((origin, obj, index) => {
      const o = origin;

      o[index + 1] = obj;

      return o;
    }, {});

  console.table(r);
});
