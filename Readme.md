
# koa-rewrite

 URL rewrite middleware for koa.

## Installation

```js
$ npm install koa-rewrite
```

## Examples

  Rewrite using a regular expression, rewriting
  `/i123` to `/items/123`.

```js
app.use(rewrite(/^\/i(\w+)/, '/items/$1'));
```

  Rewrite using route parameters, references may be named
  or numeric. For example rewrite `/foo..bar` to `/commits/foo/to/bar`:

```js
app.use(rewrite('/:src..:dst', '/commits/$1/to/$2'));
app.use(rewrite('/:src..:dst', '/commits/:src/to/:dst'));
```

  You may also use the wildcard `*` to soak up several segments,
  for example `/js/vendor/jquery.js` would become `/public/assets/js/vendor/jquery.js`:

```js
app.use(rewrite('/js/*', '/public/assets/js/$1'));
```

  All the examples above could also be provided as a rule map. Using a rule map has the benefit of
  binding a function to the object, and be able to add rules after the middleware has been called.
  For example :

```js
var rules = {
  // GET /foo..bar
  '/commits/:src/to/:dst': '/:src..:dst',

  // GET /js/jquery.js
  '/public/assets/js/$1': '/js/*'
};

app.use(rewrite(rules));

// add late route....
rules.addRule(/^\/i(\w+)/, '/items/$1');

```


## Debugging

  Use the __DEBUG__ environment variable with "koa-rewrite":

```
koa-rewrite rewrite /i123 -> /items/123 +762ms
koa-rewrite rewrite /i321 -> /items/321 +9s
koa-rewrite rewrite /i123 -> /items/123 +5s
```

## License

  MIT
