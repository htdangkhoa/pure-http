const { Router } = require('..');
const SubRouter = require('./sub-router');

const router = Router('/api');

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

router.use('/', SubRouter);

module.exports = router;
