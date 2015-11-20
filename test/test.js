'use strict';

const request = require('supertest');
const Koa = require('koa');
const rewrite = require('..');

function differentPathHelper(ctx, next) {
  const orig = ctx.path;
  return next().then(() => {
    if (orig !== ctx.path) ctx.throw(ctx.path + ' not equal to original path ' + orig);
  });
}

describe('new Koa-rewrite', function () {
  it('rewrite /^\/i(\w+)/ -> /items/$1', function (done) {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite(/^\/i(\w+)/, '/items/$1'));
    app.use(function(ctx) {
      ctx.body = ctx.path;
    });

    request(app.callback())
    .get('/i124')
    .expect('/items/124', done);
  });

  it('rewrite /:src..:dst -> /commits/$1/to/$2', function (done) {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite('/:src..:dst', '/commits/$1/to/$2'));
    app.use(function(ctx) {
      ctx.body = ctx.path;
    });

    request(app.callback())
    .get('/foo..bar')
    .expect('/commits/foo/to/bar', done);
  });

  it('rewrite /:src..:dst -> /commits/:src/to/:dst', function (done) {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite('/:src..:dst', '/commits/:src/to/:dst'));
    app.use(function(ctx) {
      ctx.body = ctx.path;
    });

    request(app.callback())
    .get('/foo..bar')
    .expect('/commits/foo/to/bar', done);
  });

  it('rewrite /js/* -> /public/assets/js/$1', function (done) {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite('/js/*', '/public/assets/js/$1'));
    app.use(function(ctx) {
      ctx.body = ctx.path;
    });

    request(app.callback())
    .get('/js/jquery.js')
    .expect('/public/assets/js/jquery.js', done);
  });

  it('rewrite /one/:arg -> /two?arg=:arg', function (done) {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite('/one/:arg', '/two?arg=:arg'));
    app.use(function(ctx) {
      ctx.body = ctx.url;
    });

    request(app.callback())
    .get('/one/test')
    .expect('/two?arg=test', done);
  });
});
