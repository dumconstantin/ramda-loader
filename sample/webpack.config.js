var webpack = require('webpack')
var path = require('path')
module.exports = {
  entry: {
    sample: `${__dirname}/src/index.js`,
    vendor: ['ramda']
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
  resolve: {
    modules: [__dirname + '/../../', 'node_modules']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
  ],
  resolveLoader: {
    alias: {
      'ramda-loader': path.join(__dirname, '../')
    }
  },
  module: {
    noParse: [/ramda/],
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }, {
      test: /.*/,
      exclude: /node_modules|wrapper/,
      use: 'ramda-loader?debug=true'
    }]
  }
}
