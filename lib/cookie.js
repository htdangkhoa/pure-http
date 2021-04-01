const crypto = require('crypto');

module.exports.serialize = function (name, value, options) {
  const opts = Object.create({});
  Object.assign(opts, options);

  const enc = opts.encode || encodeURIComponent;

  const pairs = [`${name}=${enc(value)}`];

  if (opts.maxAge != null) {
    const maxAge = opts.maxAge - 0;

    if (Number.isNaN(maxAge)) throw new Error('maxAge should be a Number');

    pairs.push(`Max-Age=${maxAge}`);
  }

  if (opts.domain) pairs.push(`Domain=${opts.domain}`);

  pairs.push(`Path=${opts.path || '/'}`);

  if (opts.expires) pairs.push(`Expires=${opts.expires.toUTCString()}`);

  if (opts.httpOnly) pairs.push('HttpOnly');

  if (opts.secure) pairs.push('Secure');

  if (opts.sameSite) {
    const sameSite =
      typeof opts.sameSite === 'string'
        ? opts.sameSite.toLowerCase()
        : opts.sameSite;

    switch (sameSite) {
      case true:
        pairs.push('SameSite=Strict');
        break;
      case 'lax':
        pairs.push('SameSite=Lax');
        break;
      case 'strict':
        pairs.push('SameSite=Strict');
        break;
      case 'none':
        pairs.push('SameSite=None');
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return pairs.join('; ');
};

module.exports.sign = function (value, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('base64')
    .replace(/=+$/, '');

  return `${value}.${hash}`;
};
