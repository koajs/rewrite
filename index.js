
/**
 * Module dependencies.
 */

var debug = require('debug')('koa-rewrite');
var toRegexp = require('path-to-regexp');

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
  var rules = [];

  function addRule(src, dst) {
    var keys = [];
    var rule = {
      re: toRegexp(src, keys),
      map: toMap(keys),
      dst: dst
    };

    rules.push(rule);

    debug('rewrite rule %s -> %s    %s', src, dst, rule.re);
  }

  if (!dst && src !== null && typeof src === 'object') {
    Object.keys(src).forEach(function (dst) {
      addRule(src[dst], dst);
    });

    src.addRule = addRule;
  } else {
    addRule(src, dst);
  }

  return function*(next){
    var orig = this.path;
    var rule;
    var m;

    for (var i = 0, ilen = rules.length; i < ilen; ++i) {
      rule = rules[i];
      m = rule.re.exec(orig);

      if (m) {
        this.path = rule.dst.replace(/\$(\d+)|(?::(\w+))/g, function(_, n, name){
          if (name) return m[rule.map[name].index + 1];
          return m[n];
        });

        debug('rewrite %s -> %s', orig, this.path);

        break;
      }
    }

    yield next;
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
  var map = {};

  params.forEach(function(param, i){
    param.index = i;
    map[param.name] = param;
  });

  return map;
}
