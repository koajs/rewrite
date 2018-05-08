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

describe('new Koa-rewrite', () => {
  it('rewrite /^\/i(\w+)/ -> /items/$1', done => {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite(/^\/i(\w+)/, '/items/$1'));
    app.use((ctx) => {
      ctx.body = ctx.path;
    });

    request(app.callback())
    .get('/i124')
    .expect('/items/124', done);
  });

  it('rewrite /:src..:dst -> /commits/$1/to/$2', done => {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite('/:src..:dst', '/commits/$1/to/$2'));
    app.use((ctx) => {
      ctx.body = ctx.path;
    });

    request(app.callback())
    .get('/foo..bar')
    .expect('/commits/foo/to/bar', done);
  });

  it('rewrite /:src..:dst -> /commits/:src/to/:dst', done => {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite('/:src..:dst', '/commits/:src/to/:dst'));
    app.use((ctx) => {
      ctx.body = ctx.path;
    });

    request(app.callback())
    .get('/foo..bar')
    .expect('/commits/foo/to/bar', done);
  });

  it('rewrite /js/(.*) -> /public/assets/js/$1', done => {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite('/js/(.*)', '/public/assets/js/$1'));
    app.use((ctx) => {
      ctx.body = ctx.path;
    });

    request(app.callback())
    .get('/js/jquery.js')
    .expect('/public/assets/js/jquery.js', done);
  });

  it('rewrite /one/:arg -> /two?arg=:arg', done => {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite('/one/:arg', '/two?arg=:arg'));
    app.use((ctx) => {
      ctx.body = ctx.url;
    });

    request(app.callback())
    .get('/one/test')
    .expect('/two?arg=test', done);
  });

  it('rewrite /one/:arg1/two:arg2 -> /one/two?arg1=:arg1&arg2=:arg2', done => {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite('/one/:arg1/two/:arg2', '/one/two?arg1=:arg1&arg2=:arg2'));
    app.use((ctx) => {
      ctx.body = ctx.url;
    });

    request(app.callback())
    .get('/one/test1/two/test2')
    .expect('/one/two?arg1=test1&arg2=test2', done);
  });

  it('rewrite /?foo=bar -> /home?foo=bar', done => {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite(/^\/((\?)(.*?))?$/, '/home$2$3'));
    app.use((ctx) => {
      ctx.body = ctx.url;
    });

    request(app.callback())
    .get('/?foo=bar')
    .expect('/home?foo=bar', done);
  });

  it('rewrite / -> /home', done => {
    const app = new Koa();
    app.use(differentPathHelper);
    app.use(rewrite(/^\/((\?)(.*?))?$/, '/home$2$3'));
    app.use((ctx) => {
      ctx.body = ctx.url;
    });

    request(app.callback())
    .get('/')
    .expect('/home', done);
  });

});
