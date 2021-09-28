const supertest = require('supertest');
const pureHttp = require('../..');

describe('params', () => {
  it(`The uid from response should be '1'.`, async () => {
    const app = pureHttp();
    app.use('/wild/:uid/*', (req, res) => res.send({ uid: req.params.uid }));

    const request = supertest(app);
    const res = await request.get('/wild/1/*');

    expect(res.body.uid).toBe('1');
  });

  it(`The uid from response should be '1'.`, async () => {
    const app = pureHttp();
    app.use('/movies/:name?/:year?', (req, res) => res.send(req.params));

    const request = supertest(app);
    const res = await request.get('/movies/star-wars');

    expect(res.body.name).toBe('star-wars');
  });

  it(`The status should be 200.`, async () => {
    const app = pureHttp();
    app.use(/^[/]foo[/](?<title>\w+)[/]?$/, (req, res) => res.send('pong'));

    const request = supertest(app);
    await request.post('/foo/bar').expect(200);
  });

  it(`The status should be 200.`, async () => {
    const app = pureHttp();
    app.use('/movies/:title.(mp4|mov)', (req, res) => res.send(req.params));

    const request = supertest(app);

    await request.post('/movies/star-wars.mp4').expect(200);
    await request.post('/movies/star-wars.mov').expect(200);
  });

  it(`The status should be 200.`, async () => {
    const app = pureHttp();
    app.use('/movies/:title.*?', (req, res) => res.send(req.params));

    const request = supertest(app);

    await request.post('/movies/star-wars.mp4').expect(200);
    await request.post('/movies/star-wars').expect(200);
  });
});
