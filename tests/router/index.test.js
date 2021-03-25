const supertest = require('supertest');
const pureHttp = require('../..');

describe('router', () => {
  it('should be matched', async () => {
    const app = pureHttp();

    const router = pureHttp.Router();
    router.get('/', (req, res) => res.send('Ok.'));
    app.use(router);

    const request = supertest(app);

    await request.get('/').expect(200);
  });

  it('should be matched', async () => {
    const app = pureHttp();

    const router = pureHttp.Router();
    router.use((req, res) => res.send('Ok.'));
    app.use('/api', router);

    const request = supertest(app);

    await request.get('/api').expect(200);
  });

  it('should be matched', async () => {
    const app = pureHttp();

    const router = pureHttp.Router('/books');
    router.use((req, res) => res.send('Ok.'));
    app.use('/api', router);

    const request = supertest(app);

    await request.get('/api/books').expect(200);
  });

  it('should be matched', async () => {
    const app = pureHttp();

    const router = pureHttp.Router('/books');
    router.use(/^\/middleware\/$/, (req, res) => res.send('Ok.'));
    app.use('/api', router);

    const request = supertest(app);

    await request.get('/api/books/middleware').expect(200);
  });

  it('should be matched', async () => {
    const app = pureHttp();

    const router = pureHttp.Router('/books');
    router.get(/^\/middleware\/$/, (req, res) => res.send('Ok.'));
    app.use('/api', router);

    const request = supertest(app);

    await request.get('/api/books/middleware').expect(200);
  });

  it('should be matched', async () => {
    const app = pureHttp();

    const router = pureHttp.Router('/books');
    router.get('/middleware', (req, res) => res.send('Ok.'));
    app.use('/api', router);

    const request = supertest(app);

    await request.get('/api/books/middleware').expect(200);
  });

  it('should be matched', async () => {
    const app = pureHttp();

    const router = pureHttp.Router(/^\/books/);
    router.get('/middleware', (req, res) => res.send('Ok.'));
    app.use('/api', router);

    const request = supertest(app);

    await request.get('/api/books/middleware').expect(200);
  });

  it('should be matched', async () => {
    const app = pureHttp();

    const router = pureHttp.Router(/^\/books/);
    router.use(/^\/middleware\/$/, (req, res) => res.send('Ok.'));
    app.use('/api', router);

    const request = supertest(app);

    await request.get('/api/books/middleware').expect(200);
  });
});
