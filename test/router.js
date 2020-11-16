const { Router } = require('..');

const router = Router();

router.get('/hello/:name', (req, res) => {
  res.send(`Hello ${req.params.name}`);
});

router.get('/query', (req, res) => {
  res.send(`Query: ${req.query.s}`);
});

router.post('/search/:s?', (req, res) => {
  res.send({ hasParams: !!req.params.s });
});

router.post('/post-body', (req, res) => {
  res.send(req.body);
});

module.exports = router;
