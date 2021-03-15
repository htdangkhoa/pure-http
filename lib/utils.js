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

function parseUrl(url) {
  const match = url.match(
    /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)/,
  );

  if (match) {
    const search = match[6];

    const query = search
      .slice(1)
      .split('&')
      .reduce((origin, q) => {
        const [key, value] = q.split('=');

        const data = origin;

        if (key) {
          Object.assign(data, { [key]: decodeURIComponent(value) });
        }

        return data;
      }, {});

    return {
      location: url,
      protocol: match[1].replace(':', ''),
      host: match[2],
      hostname: match[3],
      port: parseInt(match[4] || 80, 10),
      path: match[5],
      search,
      query,
    };
  }

  return {};
}

function merge(target, source) {
  for (const key in source) {
    if (Object.hasOwnProperty.call(source, key)) {
      const value = source[key];
      // eslint-disable-next-line no-param-reassign
      target[key] = value;
    }
  }
}

function defineProperty(obj, name, value, writable) {
  Object.defineProperty(obj, name, {
    value,
    writable,
    enumerable: true,
    configurable: true,
  });
}

module.exports = {
  regexToParams,
  parseUrl,
  merge,
  defineProperty,
};
