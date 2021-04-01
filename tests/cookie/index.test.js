const supertest = require('supertest');
const cookieParser = require('cookie-parser');
const { sign } = require('../../lib/cookie');
const pureHttp = require('../..');

describe('cookie', () => {
  describe('res.cookie', () => {
    it(`The 'foo' should be equal 'bar'.`, async (done) => {
      const app = pureHttp();
      app.use('/', (req, res) => {
        res.cookie('foo', 'bar');
        res.send(200);
      });

      const request = supertest(app);

      const res = await request.get('/');

      const cookies = res.headers['set-cookie'];

      expect(cookies.includes('foo=bar; Path=/')).toBe(true);

      done();
    });

    it(`The 'foo' should be equal 'bar' with sameSite=true.`, async (done) => {
      const app = pureHttp();
      app.use('/', (req, res) => {
        res.cookie('foo', 'bar', { sameSite: true });
        res.send(200);
      });

      const request = supertest(app);

      const res = await request.get('/');

      const cookies = res.headers['set-cookie'];

      expect(cookies.includes('foo=bar; Path=/; SameSite=Strict')).toBe(true);

      done();
    });

    it(`The 'foo' should be equal 'bar' with sameSite=strict.`, async (done) => {
      const app = pureHttp();
      app.use('/', (req, res) => {
        res.cookie('foo', 'bar', { sameSite: 'strict' });
        res.send(200);
      });

      const request = supertest(app);

      const res = await request.get('/');

      const cookies = res.headers['set-cookie'];

      expect(cookies.includes('foo=bar; Path=/; SameSite=Strict')).toBe(true);

      done();
    });

    it(`The 'foo' should be equal 'bar' with sameSite=lax.`, async (done) => {
      const app = pureHttp();
      app.use('/', (req, res) => {
        res.cookie('foo', 'bar', { sameSite: 'lax' });
        res.send(200);
      });

      const request = supertest(app);

      const res = await request.get('/');

      const cookies = res.headers['set-cookie'];

      expect(cookies.includes('foo=bar; Path=/; SameSite=Lax')).toBe(true);

      done();
    });

    it(`The 'foo' should be equal 'bar' with sameSite=none.`, async (done) => {
      const app = pureHttp();
      app.use('/', (req, res) => {
        res.cookie('foo', 'bar', { sameSite: 'none' });
        res.send(200);
      });

      const request = supertest(app);

      const res = await request.get('/');

      const cookies = res.headers['set-cookie'];

      expect(cookies.includes('foo=bar; Path=/; SameSite=None')).toBe(true);

      done();
    });

    it(`The 'foo' should be equal 'bar' with signed=true.`, async (done) => {
      const app = pureHttp();
      app.use(cookieParser('cat'));
      app.use('/', (req, res) => {
        res.cookie('foo', 'bar', { signed: true });
        res.send(200);
      });

      const request = supertest(app);

      const res = await request.get('/');

      const cookies = res.headers['set-cookie'];

      const expectValue = encodeURIComponent(`s:${sign('bar', 'cat')}`);

      expect(cookies.includes(`foo=${expectValue}; Path=/`)).toBe(true);

      done();
    });

    it(`The 'foo' should be equal '{ "ping": "pong" }'.`, async (done) => {
      const app = pureHttp();
      app.use('/', (req, res) => {
        res.cookie('foo', { ping: 'pong' });
        res.send(200);
      });

      const request = supertest(app);

      const res = await request.get('/');

      const cookies = res.headers['set-cookie'];

      const expectValue = encodeURIComponent(
        `j:${JSON.stringify({ ping: 'pong' })}`,
      );

      expect(cookies.includes(`foo=${expectValue}; Path=/`)).toBe(true);

      done();
    });

    it(`The status should be 500 with wrong maxAge type.`, async () => {
      const app = pureHttp();
      app.use('/', (req, res) => {
        res.cookie('foo', 'bar', {
          sameSite: 1,
          maxAge: {},
          httpOnly: true,
          secure: true,
          domain: req.originalUrl,
        });

        res.send(200);
      });

      const request = supertest(app);

      await request.post('/').expect(500);
    });

    it(`The status should be 500 with wrong sameSite type.`, async () => {
      const app = pureHttp();
      app.use('/', (req, res) => {
        res.cookie('foo', 'bar', {
          sameSite: 1,
          maxAge: 60000,
          httpOnly: true,
          secure: true,
          domain: req.originalUrl,
        });

        res.send(200);
      });

      const request = supertest(app);

      await request.post('/').expect(500);
    });

    it(`The status should be 500 with option signed=true without secret.`, async () => {
      const app = pureHttp();
      app.use('/', (req, res) => {
        res.cookie('foo', 'bar', { signed: true });

        res.send(200);
      });

      const request = supertest(app);

      await request.post('/').expect(500);
    });
  });

  describe('res.clearCookie', () => {
    it(`The 'foo' should be empty.`, async (done) => {
      const app = pureHttp();
      app.use((req, res, next) => {
        res.cookie('foo', 'bar');

        return next();
      });
      app.use('/', (req, res) => {
        res.clearCookie('foo');
        res.send(200);
      });

      const request = supertest(app);

      const res = await request.get('/');

      const cookies = res.headers['set-cookie'];

      expect(!!cookies.find((cookie) => cookie.startsWith('foo=;'))).toBe(true);

      done();
    });
  });

  describe('req.cookies', () => {
    it(`The cookie must be set in request.`, async () => {
      const app = pureHttp();
      app.use(cookieParser());
      app.use('/', (req, res) => {
        res.send(req.cookies);
      });

      const request = supertest(app);

      await request
        .get('/')
        .set('Cookie', ['foo=bar', 'ping=pong'])
        .expect({ foo: 'bar', ping: 'pong' });
    });
  });

  describe('req.signedCookies', () => {
    it(`The status should be 200 and the body should be equal { "foo": "bar" }.`, async () => {
      const app = pureHttp();
      app.use(cookieParser('cat'));
      app.use('/', (req, res) => {
        res.send(req.signedCookies);
      });

      const request = supertest(app);

      const val = sign('bar', 'cat');

      await request
        .post('/')
        .set('Cookie', `foo=s:${val}`)
        .expect(200, { foo: 'bar' });
    });
  });
});
