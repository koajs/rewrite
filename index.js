
/**
 * Module dependencies.
 */

 const debug = require('debug')('koa-rewrite');
 const toRegexp = require('path-to-regexp');

/**
 * Expose `expose`.
 */

module.exports = rewrite;

/**
 * Rwrite `src` to `dst`.
 *
 * @param {String|RegExp} src
 * @param {String} dst
 * @return {Function}
 * @api public
 */

function rewrite(src, dst) {
  const keys = [];
  const re = toRegexp(src, keys);
  const map = toMap(keys);

  debug('rewrite %s -> %s    %s', src, dst, re);

  return function*(next){
    const orig = this.path;
    const m = re.exec(orig);
    
    if (m) {
      this.path = dst.replace(/\$(\d+)|(?::(\w+))/g, function(_, n, name){
        if (name) return m[map[name].index + 1];
        return m[n];
      });

      debug('rewrite %s -> %s', orig, this.path);

      yield* next;

      this.path = orig;
      return;
    }

    yield* next;
  }
}

/**
 * Turn params array into a map for quick lookup.
 *
 * @param {Array} params
 * @return {Object}
 * @api private
 */

function toMap(params) {
  const map = {};

  params.forEach(function(param, i){
    param.index = i;
    map[param.name] = param;
  });

  return map;
}
