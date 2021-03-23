const supertest = require('supertest');
const pureHttp = require('../..');

describe('jsonp', () => {
  it('should respond with jsonp', async () => {
    const app = pureHttp();
    app.use('/', (req, res) => res.jsonp({ message: 'Hello World!' }));

    const request = supertest(app);

    await request
      .get('/')
      .query({ callback: 'foo' })
      .expect('content-type', 'text/javascript; charset=utf-8')
      .expect(200, /foo\(\{"message":"Hello World!"\}\);/);
  });

  it('should respond with jsonp', async () => {
    const app = pureHttp();
    app.use('/', (req, res) =>
      res.jsonp({ '&': '\u2028<script>\u2029' }, { escape: true }),
    );

    const request = supertest(app);

    await request
      .get('/')
      .query({ callback: 'foo' })
      .expect('content-type', 'text/javascript; charset=utf-8')
      .expect(200, /foo\({"\\u0026":"\\u2028\\u003cscript\\u003e\\u2029"}\)/);
  });

  it('should respond with jsonp', async () => {
    const app = pureHttp();
    app.use('/', (req, res) => {
      res.jsonp(
        { name: 'tobi', _id: 12345 },
        {
          replacer: (key, val) => {
            return key[0] === '_' ? undefined : val;
          },
        },
      );
    });

    const request = supertest(app);

    await request
      .get('/')
      .expect('content-type', 'application/json; charset=utf-8')
      .expect(200, '{"name":"tobi"}');
  });

  it('should respond with jsonp', async () => {
    const app = pureHttp();
    app.use('/', (req, res) =>
      res.jsonp({ name: 'tobi', age: 2 }, { spaces: 2 }),
    );

    const request = supertest(app);

    await request
      .get('/')
      .expect('content-type', 'application/json; charset=utf-8')
      .expect(200, '{\n  "name": "tobi",\n  "age": 2\n}');
  });

  it('should respond with jsonp', async () => {
    const app = pureHttp();
    app.use('/', (req, res) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');

      res.jsonp({ message: 'Hello World!' });
    });

    const request = supertest(app);

    await request
      .get('/')
      .query({ callback: 'foo' })
      .expect('content-type', 'text/javascript; charset=utf-8')
      .expect(200, /foo\(\{"message":"Hello World!"\}\);/);
  });
});
