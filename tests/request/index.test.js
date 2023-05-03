const supertest = require('supertest');
const pureHttp = require('../..');

describe('request', () => {
  describe('.secure', () => {
    it('when X-Forwarded-Proto is missing.', async () => {
      const app = pureHttp();
      app.use((req, res) => res.send(req.secure ? 'yes' : 'no'));

      const request = supertest(app);

      const res = await request.get('/');

      expect(res.text).toBe('no');
    });

    it('when X-Forwarded-Proto is present.', async () => {
      const app = pureHttp();
      app.use((req, res) => res.send(req.secure ? 'yes' : 'no'));

      const request = supertest(app);

      const res = await request.get('/').set('X-Forwarded-Proto', 'https');

      expect(res.text).toBe('yes');
    });

    it(`should default to the socket addr if X-Forwarded-Proto not present.`, async () => {
      const app = pureHttp();
      app.use((req, res) => {
        req.connection.encrypted = true;

        res.send(req.secure ? 'yes' : 'no');
      });

      const request = supertest(app);

      const res = await request.get('/');

      expect(res.text).toBe('yes');
    });
  });

  describe('.hostname', () => {
    it('should return the string.', async () => {
      const app = pureHttp();
      app.use((req, res) => res.send(req.hostname));

      const request = supertest(app);
      const res = await request.get('/');

      expect(res.text).toBe('127.0.0.1');
    });
  });

  describe('.host', () => {
    it('should return the string.', async () => {
      const app = pureHttp();
      app.use((req, res) => res.send(req.host));

      const request = supertest(app);
      const res = await request.get('/');

      expect(res.text).toBe('127.0.0.1');
    });
  });

  describe('.port', () => {
    it('should return the number.', async () => {
      const app = pureHttp();
      app.use((req, res) => res.send(req.port.toString()));

      const request = supertest(app);
      const res = await request.get('/');

      expect(typeof parseInt(res.text, 10) === 'number').toBe(true);
    });

    it('should return 80.', async () => {
      const app = pureHttp();
      app.use((req, res) => {
        req.headers.host = 'example.com';

        res.send(req.port.toString());
      });

      const request = supertest(app);
      const res = await request.get('/');

      expect(typeof parseInt(res.text, 10) === 'number').toBe(true);
    });

    it('should return 443.', async () => {
      const app = pureHttp();
      app.use((req, res) => {
        req.headers.host = 'example.com';

        res.send(req.port.toString());
      });

      const request = supertest(app);
      const res = await request.get('/').set('X-Forwarded-Proto', 'https');

      expect(typeof parseInt(res.text, 10) === 'number').toBe(true);
    });
  });

  describe('.path', () => {
    it('should return the string.', async () => {
      const app = pureHttp();
      app.use((req, res) => res.send(req.path));

      const request = supertest(app);
      const res = await request.get('/');

      expect(res.text).toBe('/');
    });
  });
});
