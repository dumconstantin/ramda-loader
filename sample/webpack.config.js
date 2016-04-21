
module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    filename: __dirname + '/dist/bundle.js'
  },
  resolveLoader: {
    modulesDirectories: [__dirname + '/../../', 'node_modules']
  },
  module: {
    loaders: [
      { test: /.*/, exclude: /node_modules/, loader: 'ramda-debug-loader' }
    ]
  }
}
