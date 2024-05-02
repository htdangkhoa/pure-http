const supertest = require('supertest');
const pureHttp = require('../..');

describe('configs', () => {
  it('should set and get configs', async () => {
    const app = pureHttp();
    app.set('foo', 'bar');
    app.set('lorem', 'ipsum');

    app.use((req, res) => {
      const foo = req.app.get('foo');
      const lorem = req.app.get('lorem');
      res.send({
        foo,
        lorem,
      });
    });

    const request = supertest(app);
    const res = await request.get('/');

    const expected = {
      foo: 'bar',
      lorem: 'ipsum',
    };

    expect(res.body).toEqual(expected);
  });

  it('should return undefined if the config is not set', async () => {
    const app = pureHttp();

    app.use((req, res) => {
      const foo = req.app.get('foo');
      res.send(String(foo));
    });

    const request = supertest(app);
    await request.get('/').expect(200, 'undefined');
  });
});
