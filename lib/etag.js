const { createHash } = require('crypto');
const { Stats } = require('fs');

function statTag({ mtime, size }) {
  return `"${mtime.getTime().toString(16)}-${size.toString(16)}"`;
}

function entityTag(entity) {
  if (entity.length === 0) {
    // fast-path empty
    return '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"';
  }

  const hash = createHash('sha1')
    .update(entity.toString(), 'utf8')
    .digest('base64')
    .substring(0, 27);

  const length = entity.length;

  return `"${length.toString(16)}-${hash}"`;
}

function eTag(entity) {
  // generate entity tag
  const tag = entity instanceof Stats ? statTag(entity) : entityTag(entity);

  return `W/${tag}`;
}

module.exports = function (body, encoding) {
  if (body instanceof Stats) {
    return eTag(body);
  }

  return eTag(!Buffer.isBuffer(body) ? Buffer.from(body, encoding) : body);
};
