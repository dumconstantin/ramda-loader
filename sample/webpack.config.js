var webpack = require('webpack')

module.exports = {
  entry: {
    sample: __dirname + '/src/invalid-1.js',
    vendor: [
      'ramda'
    ]
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  output: {
    filename: __dirname + '/dist/bundle.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  resolveLoader: {
    modulesDirectories: [__dirname + '/../../', 'node_modules']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
  ],
  module: {
    noParse: [
      /^ramda$/
    ],
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' ,
        query: { presets: ['es2015'] }
      },
      { test: /.*/, exclude: /node_modules/, loader: 'ramda-debug-loader' }
    ]
  }
}
