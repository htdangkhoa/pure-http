const types = require('./mime-types.json');

function getExtFromPath(path) {
  const pathString = String(path);

  const last = path.replace(/^.*[/\\]/, '').toLowerCase();
  const ext = last.replace(/^.*\./, '').toLowerCase();

  const hasPath = last.length < pathString.length;
  const hasDot = ext.length < last.length - 1;

  return ((hasDot || !hasPath) && `.${ext}`) || null;
}

function getMimeType(path) {
  const ext = getExtFromPath(path);

  return types[ext || '.html'].type;
}

module.exports = {
  getExtFromPath,
  getMimeType,
};
