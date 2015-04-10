var request = require('supertest');
var koa = require('koa');
var rewrite = require('..');

describe('koa-rewrite', function () {
  it('rewrite /^\/i(\w+)/ -> /items/$1', function (done) {
    var app = koa();
    app.use(function* (next) {
      var orig = this.path;
      yield* next;
      if (orig !== this.path) this.throw(this.path + ' not equal to original path ' + orig);
    });
    app.use(rewrite(/^\/i(\w+)/, '/items/$1'));
    app.use(function* () {
      this.body = this.path;
    });

    request(app.callback())
    .get('/i124')
    .expect('/items/124', done);
  });

  it('rewrite /:src..:dst -> /commits/$1/to/$2', function (done) {
    var app = koa();
    app.use(function* (next) {
      var orig = this.path;
      yield* next;
      if (orig !== this.path) this.throw(this.path + ' not equal to original path ' + orig);
    });
    app.use(rewrite('/:src..:dst', '/commits/$1/to/$2'));
    app.use(function* () {
      this.body = this.path;
    });

    request(app.callback())
    .get('/foo..bar')
    .expect('/commits/foo/to/bar', done);
  });

  it('rewrite /:src..:dst -> /commits/:src/to/:dst', function (done) {
    var app = koa();
    app.use(function* (next) {
      var orig = this.path;
      yield* next;
      if (orig !== this.path) this.throw(this.path + ' not equal to original path ' + orig);
    });
    app.use(rewrite('/:src..:dst', '/commits/:src/to/:dst'));
    app.use(function* () {
      this.body = this.path;
    });

    request(app.callback())
    .get('/foo..bar')
    .expect('/commits/foo/to/bar', done);
  });

  it('rewrite /js/* -> /public/assets/js/$1', function (done) {
    var app = koa();
    app.use(function* (next) {
      var orig = this.path;
      yield* next;
      if (orig !== this.path) this.throw(this.path + ' not equal to original path ' + orig);
    });
    app.use(rewrite('/js/*', '/public/assets/js/$1'));
    app.use(function* () {
      this.body = this.path;
    });

    request(app.callback())
    .get('/js/jquery.js')
    .expect('/public/assets/js/jquery.js', done);
  });
});