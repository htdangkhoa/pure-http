const { Router } = require('..');

const router = Router('/sub-router');

router.get('/test', (req, res) => {
  res.send(req.originalUrl);
});

module.exports = router;
