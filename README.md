Native functional programming in JavaScript with [Ramda](http://ramdajs.com/) and [Webpack](http://webpack.github.io/)
=============

[![Build Status](https://travis-ci.org/dumconstantin/ramda-loader.svg?branch=master)](https://travis-ci.org/dumconstantin/ramda-loader)
[![npm version](https://badge.fury.io/js/ramda-loader.svg)](https://badge.fury.io/js/ramda-loader)
[![dependencies](https://david-dm.org/dumconstantin/ramda-loader.svg)](https://david-dm.org/dumconstantin/ramda-loader)

Write beautiful functional programming code in JavaScript without namespacing or importing functions by hand.

Enforces Ramda names for a clean and consistent code base.
Features enhanced debbuging that gives you precise stack traces for point-free programming with Ramda.

Install
----------

```bash
$ npm install --save-dev ramda-loader
```
Add the loader to your `webpack.config.js`:

```javascript
module.exports = {
    // ...
    module: {
      loaders: [
        // debug=true will wrap RamdaJs functions in error handlers with file name, line number and char location
        { test: /\.js$/, exclude: /node_modules/, loader: 'ramda-loader?debug=true' }
      ]
    }
}
```

Description
----------

``` ramda-loader ``` uses [Abstract Syntax Tree (AST)](http://jointjs.com/demos/javascript-ast) parsing and analysing to instrument your code and produce new code.
This way you gain confidence that you can use Ramda functions anywhere and your code will continue to work exactly the same as before.

In order promote [point-free programming](http://lucasmreis.github.io/blog/pointfree-javascript/),
``` ramda-loader ``` enforces that you don't redeclare the names used by Ramda.
This ensures you achieve a standardised codebase that anyone can understand just by looking at [Ramda's documentation](http://ramdajs.com/docs/) - less maintanance on your side and less documentation to write.

Example
----------

Given this file:
```javascript
var add10 = add(10)

var answer = pipe(
  add10,
  ifElse(
    equals(42),
    always('The answer to your Ramda import problems'),
    subtract(10)
  )
)

answer(32) // The answer to your Ramda import problems
```

it will automatically import all the Ramda functions found:
```javascript
var R = __webpack_require__(1)
var add = R.add
var pipe = R.pipe
var ifElse = R.ifElse
var equals = R.equals
var always = R.always
var subtract = R.subtract
var __ = R.__

var add10 = add(10)

var answer = pipe(
	add10,
	ifElse(
	  equals(42),
	  always('The answer to your Ramda import problems'),
	  subtract(__, 10)
	)
)

answer(32) // The answer to your Ramda import problems
```

and with the ``` debug=true ``` this becomes:
```javascript
var __ramdaDebugWrapper = __webpack_require__(1).fn;
var add = R.add
var pipe = R.pipe
var ifElse = R.ifElse
var equals = R.equals
var always = R.always
var subtract = R.subtract
var __ = R.__

var add10 = __ramdaDebugWrapper('../sample/src/index.js', 1, 15, 'add', add)(10);

var answer = __ramdaDebugWrapper('../sample/src/index.js', 3, 16, 'pipe', pipe)(add10, __ramdaDebugWrapper('../sample/src/index.js', 5, 3, 'ifElse', ifElse)(__ramdaDebugWrapper('../sample/src/index.js', 6, 5, 'equals', equals)(42), __ramdaDebugWrapper('../sample/src/index.js', 7, 5, 'always', always)('The answer to your Ramda import problems'), __ramdaDebugWrapper('../sample/src/index.js', 8, 5, 'subtract', subtract)(__, 10)));

module.exports = answer;

```

Build
----------
Install the dependencies, via:

```bash
$ npm install
```
then you can run:

```bash
$ npm run build
```
which will build the loader in the ``` /dist ``` folder.

Running The Test Suite
----------
Install the dependencies (see Build)

Then you can run the tests by running (which also builds the loader):

```bash
$ npm test
```

## Contributing:

Feel free to open issues to propose stuff and participate. Pull requests are also welcome.

## Licence:

[MIT](http://en.wikipedia.org/wiki/MIT_License)
