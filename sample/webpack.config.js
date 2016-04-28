var webpack = require('webpack')

module.exports = {
  entry: {
    sample: __dirname + '/src/index.js',
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
    path: `${__dirname}/dist`,
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  resolveLoader: {
    modulesDirectories: [__dirname + '/../../', 'node_modules']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
  ],
  module: {
    noParse: [
      'ramda'
    ],
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' ,
        query: { presets: ['es2015'] }
      },
      { test: /.*/, exclude: /node_modules|wrapper/, loader: 'ramda-loader?debug=true' }
    ]
  }
}
