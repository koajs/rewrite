
var rewrite = require('./');
var koa = require('koa');

var app = koa();


var rules = {
  // GET /foo..bar
  '/commits/:src/to/:dst': '/:src..:dst',

  // GET /js/jquery.js
  '/public/assets/js/$1': '/js/*'
};

// GET /i124
app.use(rewrite(/^\/i(\w+)/, '/items/$1'));

// GET /foo..bar
//app.use(rewrite('/:src..:dst', '/commits/$1/to/$2'));
//app.use(rewrite('/:src..:dst', '/commits/:src/to/:dst'));

// GET /js/jquery.js
//app.use(rewrite('/js/*', '/public/assets/js/$1'));

app.use(rewrite(rules));

app.use(function*(){
  this.body = this.url + '\n';
});

app.listen(3000);
console.log('listening on port 3000');


// add late route....
rules.addRule(/^\/foo\/(.*)/, '/bar/$1');
