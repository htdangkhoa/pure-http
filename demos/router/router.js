/* eslint-disable */
const pureHttp = require('../..');

const router = pureHttp.Router('/v1');

router.get('/hello/:name', (req, res) => {
  res.send(`Hello ${req.params.name}!`);
});

module.exports = router;
