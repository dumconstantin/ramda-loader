# [Webpack](http://webpack.github.io/) loader for RamdaJs debugging

Save time and energy when working with RamdaJs by knowing exactly where the File name and Line number where the RamdaJs function was used.

If you also use RxJs/KefirJs with Ramda this will alleviate the pain of going through screen long call stacks spanning over multiple processes (don't forget to tick the "Capture async stack traces" in Chrome Dev Tools)

Use it in your Webpack build process to augment each RamdaJs function with the File name and Line number. When errors are thrown, those details are included in the error message.

For development usage only! Not suitable for production!

## Install:

```bash
$ npm install --save-dev ramda-debug-loader
```

## Usage:

Add the loader to your `webpack.config.js`:

```javascript
module.exports = {
    // ...
    module: {
      loaders: [

        { test: /\.js$/, exclude: /node_modules/, loader: 'ramda-debug-loader' }

      ]
    }
}
```

## Contributing:

Feel free to open issues to propose stuff and participate. Pull requests are also welcome.

## Licence:

[MIT](http://en.wikipedia.org/wiki/MIT_License)
