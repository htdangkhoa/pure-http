module.exports.one = function (req, res, next) {
  req.one = true;

  next();
};

module.exports.two = function (req, res, next) {
  req.two = true;

  next();
};
