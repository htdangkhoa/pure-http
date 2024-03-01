/*!
 * regexparam v2.0.2
 * https://github.com/lukeed/regexparam
 *
 * Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 * Released under the MIT license
 */
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

function regexToString(str, loose) {
  let s = str;
  s = s
    .toString()
    .replace(/[.*+\-?^${}()|[\]\\]/g, '')
    .replace(/\/{2,}/g, '/');

  s = s.substring(loose ? 1 : 0, s.length - 1);

  return s;
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
  regexToString,
  defineProperty,
  defineGetter,
};
