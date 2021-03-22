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

  it(`The response text should be 'OK'.`, async (done) => {
    const app = pureHttp();
    app.use((req, res) => res.send(200));

    const request = supertest(app);

    const res = await request.get('/');

    expect(res.text).toBe(STATUS_CODES[200]);

    done();
  });

  it(`The response text should be '999'.`, async (done) => {
    const app = pureHttp();
    app.use((req, res) => res.send(999));

    const request = supertest(app);

    const res = await request.get('/');

    expect(res.text).toBe('999');

    done();
  });

  it(`The response text should be empty when data is 'null'.`, async (done) => {
    const app = pureHttp();
    app.use((req, res) => res.send(null));

    const request = supertest(app);

    const res = await request.get('/');

    expect(res.text).toBe('');

    done();
  });

  it(`The response text should be empty when data is 'undefined'.`, async (done) => {
    const app = pureHttp();
    app.use((req, res) => res.send(undefined));

    const request = supertest(app);

    const res = await request.get('/');

    expect(res.text).toBe('');

    done();
  });

  it(`The response should be a Buffer.`, async (done) => {
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
        if (error) return done(error);

        expect(Buffer.isBuffer(res.body)).toBe(true);

        return done();
      });
  });

  it(`The response should be a Buffer.`, async (done) => {
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
      if (error) return done(error);

      expect(Buffer.isBuffer(res.body)).toBe(true);

      return done();
    });
  });

  it(`The 'content-type' in header should be 'text/css; charset=utf-8'.`, async () => {
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
