function set(key, value) {
  if (!this.locals) {
    this.locals = {};
  }

  this.locals[key] = value;
}

function get(key) {
  if (!this.locals) {
    return undefined;
  }

  return this.locals[key];
}

module.exports = {
  set,
  get,
};
