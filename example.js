
var rewrite = require('./');
var koa = require('koa');

var app = koa();

// GET /i124
app.use(rewrite(/^\/i(\w+)/, '/items/$1'));

// GET /foo..bar
//app.use(rewrite('/:src..:dst', '/commits/$1/to/$2'));
app.use(rewrite('/:src..:dst', '/commits/:src/to/:dst'));

// GET /js/jquery.js
app.use(rewrite('/js/*', '/public/assets/js/$1'));

app.use(function*(){
  this.body = this.url + '\n';
});

app.listen(3000);
console.log('listening on port 3000');