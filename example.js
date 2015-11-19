'use strict';

const rewrite = require('./');
const Koa = require('koa');

const app = new Koa();

// GET /i124
app.use(rewrite(/^\/i(\w+)/, '/items/$1'));

// GET /foo..bar
//app.use(rewrite('/:src..:dst', '/commits/$1/to/$2'));
app.use(rewrite('/:src..:dst', '/commits/:src/to/:dst'));

// GET /js/jquery.js
app.use(rewrite('/js/*', '/public/assets/js/$1'));

app.use(function(ctx) {
  ctx.body = ctx.url + '\n';
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
