class Cache {
  constructor(options) {
    const { max = Infinity, maxAge = 0, stale } = options || {};

    this.max = max;

    this.maxAge = maxAge;

    this.stale = stale;

    this.clear();
  }

  clear() {
    this.current = Object.create(null);
  }

  has(key) {
    if (typeof key !== 'string') return false;

    return !!this.current[key];
  }

  get(key) {
    if (typeof key !== 'string') return undefined;

    const val = this.current[key];

    if (!val) return val;

    const { value, expires } = val;

    if (expires && Date.now() >= expires) {
      delete this.current[key];

      return this.stale ? value : undefined;
    }

    return val;
  }

  set(key, value) {
    if (typeof key !== 'string') {
      throw new Error('Key must be a string.');
    }

    if (this.has(key)) {
      delete this.current[key];
    }

    const keys = Object.keys(this.current);

    if (keys.length >= this.max) {
      delete this.current[keys[0]];
    }

    const expires = this.maxAge > -1 && this.maxAge + Date.now();

    Object.assign(this.current, {
      [key]: {
        value,
        expires,
      },
    });
  }

  delete(key) {
    if (typeof key !== 'string') return false;

    delete this.current[key];

    return true;
  }
}

module.exports = Cache;
