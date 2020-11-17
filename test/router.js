const { Router } = require('..');

const router = Router();

router
  .get('/hello/:name', (req, res) => {
    res.send(`Hello ${req.params.name}`);
  })
  .get('/query', (req, res) => {
    res.send(`Query: ${req.query.s}`);
  })
  .post('/search/:s?', (req, res) => {
    res.send({ hasParams: !!req.params.s });
  })
  .post('/post-body', (req, res) => {
    res.send(req.body);
  });

module.exports = router;
