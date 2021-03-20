function regexToParams(str, loose) {
  if (str instanceof RegExp) return { keys: false, pattern: str };

  let c;

  let o;

  let tmp;

  let ext;

  const keys = [];

  let pattern = '';

  const arr = str.split('/');

  arr[0] || arr.shift();

  while ((tmp = arr.shift())) {
    c = tmp[0];

    if (c === '*') {
      keys.push('wild');
      pattern += '/(.*)';
    } else if (c === ':') {
      o = tmp.indexOf('?', 1);
      ext = tmp.indexOf('.', 1);
      keys.push(tmp.substring(1, ~o ? o : ~ext ? ext : tmp.length));
      pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
      if (~ext) pattern += `${~o ? '?' : ''}\\${tmp.substring(ext)}`;
    } else {
      pattern += `/${tmp}`;
    }
  }

  return {
    keys,
    pattern: new RegExp(`^${pattern}${loose ? '(?=$|/)' : '/?$'}`, 'i'),
  };
}

function defineProperty(obj, name, value, options) {
  const base = { enumerable: false, configurable: true, value };

  Object.assign(base, options);

  Object.defineProperty(obj, name, base);
}

function defineGetter(obj, name, getter, options) {
  const base = { get: getter };

  Object.assign(base, options);

  Object.defineProperty(obj, name, base);
}

module.exports = {
  regexToParams,
  defineProperty,
  defineGetter,
};
