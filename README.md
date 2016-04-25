# Use functional programming natively in JavaScript with [RamdaJs](http://ramdajs.com/) and [Webpack](http://webpack.github.io/)

Start writing beautiful functional programming code in JavaScript without the ``` R. ``` namespace or worring about importing functions by hand.

With the ``` debug=true ``` flag you'll get you'll get the precise location of where you used each RamdaJs functions. You avoid going through long stack traces and you'll get the File name, Line number and Char location from your original file at the top of the stack trace for quick and easy debugging.

## Install:

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

## Description:

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

it automatically adds the RamdaJs functions to the header of the file:
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

## Contributing:

Feel free to open issues to propose stuff and participate. Pull requests are also welcome.

## Licence:

[MIT](http://en.wikipedia.org/wiki/MIT_License)
