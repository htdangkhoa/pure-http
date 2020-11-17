# Benchmarks

> ⚠️ **WARNING: Results may vary on different devices.**

## Requirement

- [`wrk`](https://github.com/wg/wrk)

## Usage

```bash
$ node index.js [arguments (options)]
```

## Arguments

- `-h, --help`: display help for command.
- `-p, --port`: port's server `(default: 3000)`.
- `-c, --connections`: total number of HTTP connections to keep open with each thread handling N = connections/threads `(default: 100)`.
- `-d, --duration`: duration of the test, e.g. 2s, 2m, 2h `(default: "30s")`.
- `-t, --threads`: total number of threads to use `(default: 8)`.

## Results

> Please remember that your application code is most likely the slowest part of your application!
> Switching from Express to pure-http will (likely) not guarantee the same performance gains.

- **Machine:** Ubuntu-s-1vcpu-1gb-sgp1-01, x86-64, Ubuntu 18.04.5 LTS, Intel(R) Xeon(R) CPU E5-2650 v4 @ 2.20GHz, 16GB RAM.
- **Node:** `v12.18.4`
- **Run:** Fri, 13 Nov 2020 21:07:21

| Framework                  |    Version | Requests/Sec |     Latency |
| -------------------------- | ---------: | :----------: | ----------: |
| **pure-http (with cache)** | **latest** | **\~ 8,792** | **10.92ms** |
| pure-http                  |     latest |   ~ 8,633    |     11.12ms |
| polka                      |      0.5.2 |   ~ 7,364    |     13.03ms |
| express                    |     4.17.1 |   ~ 3,588    |     26.86ms |
| fastify                    |      3.8.0 |   ~ 2,702    |     35.54ms |
