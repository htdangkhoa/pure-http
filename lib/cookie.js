const encode = encodeURIComponent;
const decode = decodeURIComponent;

function serialize(name, value, options) {
  const opt = options || {};

  const enc = opt.encode || encode;

  const pairs = [`${name}=${enc(value)}`];

  if (opt.maxAge != null) {
    const maxAge = opt.maxAge - 0;

    if (Number.isNaN(maxAge)) throw new Error('maxAge should be a Number');

    pairs.push(`Max-Age=${maxAge}`);
  }

  if (opt.domain) pairs.push(`Domain=${opt.domain}`);

  if (opt.path) pairs.push(`Path=${opt.path}`);

  if (opt.expires) pairs.push(`Expires=${opt.expires.toUTCString()}`);

  if (opt.httpOnly) pairs.push('HttpOnly');

  if (opt.secure) pairs.push('Secure');

  if (opt.sameSite) {
    const sameSite =
      typeof opt.sameSite === 'string'
        ? opt.sameSite.toLowerCase()
        : opt.sameSite;

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
}

function parse(str, options) {
  const opt = options || {};

  const obj = {};

  const pairs = str.split(/; */);

  const dec = opt.decode || decode;

  for (let i = 0; i < pairs.length; i += 1) {
    const pair = pairs[i];

    const eqIdx = pair.indexOf('=');

    if (eqIdx >= 0) {
      const key = pair.substr(0, eqIdx).trim();

      let val = pair.substr(eqIdx + 1, pair.length).trim();

      if (val[0] === '"') {
        val = val.slice(1, -1);
      }

      if (obj[key] === undefined) {
        try {
          obj[key] = dec(val);
        } catch (e) {
          obj[key] = val;
        }
      }
    }
  }

  return obj;
}

module.exports = {
  serialize,
  parse,
};
