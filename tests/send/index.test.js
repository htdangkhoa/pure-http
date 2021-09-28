const { STATUS_CODES } = require('http');
const path = require('path');
const fs = require('fs');
const supertest = require('supertest');
const pureHttp = require('../..');

describe('send', () => {
  it(`The response text should be empty when request's method is 'HEAD'.`, async () => {
    const app = pureHttp();
    app.use((req, res) => res.send(200));

    const request = supertest(app);

    await request.head('/').expect(200);
  });

  it(`The response text should be 'OK'.`, async () => {
    const app = pureHttp();
    app.use((req, res) => res.send(200));

    const request = supertest(app);

    const res = await request.get('/');

    expect(res.text).toBe(STATUS_CODES[200]);
  });

  it(`The response text should be '999'.`, async () => {
    const app = pureHttp();
    app.use((req, res) => res.send(999));

    const request = supertest(app);

    const res = await request.get('/');

    expect(res.text).toBe('999');
  });

  it(`The response text should be empty when data is 'null'.`, async () => {
    const app = pureHttp();
    app.use((req, res) => res.send(null));

    const request = supertest(app);

    const res = await request.get('/');

    expect(res.text).toBe('');
  });

  it(`The response text should be empty when data is 'undefined'.`, async () => {
    const app = pureHttp();
    app.use((req, res) => res.send(undefined));

    const request = supertest(app);

    const res = await request.get('/');

    expect(res.text).toBe('');
  });

  it(`The response should be a Buffer.`, async () => {
    const app = pureHttp();
    app.use((req, res) => {
      const imgPath = path.resolve(process.cwd(), 'tests/public/image.png');

      const readableStream = fs.createReadStream(imgPath);

      return res.send(readableStream);
    });

    const request = supertest(app);

    request
      .get('/')
      .buffer()
      .parse((res, cb) => {
        res.setEncoding('binary');
        res.data = '';
        res.on('data', function (chunk) {
          res.data += chunk;
        });
        res.on('end', function () {
          cb(null, Buffer.from(res.data, 'binary'));
        });
      })
      .end((error, res) => {
        expect(Buffer.isBuffer(res.body)).toBe(true);
      });
  });

  it(`The response should be a Buffer.`, async () => {
    const app = pureHttp();
    app.use((req, res) => {
      const imgPath = path.resolve(process.cwd(), 'tests/public/image.png');

      const readableStream = fs.createReadStream(imgPath);

      const chunks = [];

      readableStream.on('data', (chunk) => chunks.push(chunk));
      readableStream.on('end', () => {
        const buffer = Buffer.concat(chunks);

        return res.send(buffer);
      });
    });

    const request = supertest(app);

    request.get('/').end((error, res) => {
      expect(Buffer.isBuffer(res.body)).toBe(true);
    });
  });

  it(`The 'content-type' in header should be 'text/css; charset=utf-8' without options.`, async () => {
    const app = pureHttp();
    app.use((req, res) => {
      const filePath = path.resolve(process.cwd(), 'tests/public/index.css');

      res.sendFile(filePath);
    });

    const request = supertest(app);

    await request
      .post('/send-file')
      .expect('content-type', 'text/css; charset=utf-8');
  });

  it(`The 'content-type' in header should be 'text/css; charset=utf-8' with options.`, async () => {
    const app = pureHttp();
    app.use((req, res) => {
      const filePath = path.resolve(process.cwd(), 'tests/public/index.css');

      res.sendFile(filePath, { headers: { 'Cache-Control': 'no-store' } });
    });

    const request = supertest(app);

    await request
      .post('/send-file')
      .expect('cache-control', 'no-store')
      .expect('content-type', 'text/css; charset=utf-8');
  });
});
