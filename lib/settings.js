function set(key, value) {
  if (!this.settings) {
    this.settings = {};
  }

  this.settings[key] = value;
}

function get(key) {
  if (!this.settings) {
    return undefined;
  }

  return this.settings[key];
}

module.exports = {
  set,
  get,
};
