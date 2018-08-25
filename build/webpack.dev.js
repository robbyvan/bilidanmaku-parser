var path = require('path')
var webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: './src/index',
  output: {
    path: resolve('dist'),
    filename: 'danmaku.js',
    library: 'Danmaku',
    libraryTarget: 'umd',
    publicPath: '/assets/'
  },
  devServer: {
    port: 9091,
    host: '0.0.0.0',
    overlay: {
      errors: true,
    },
    historyApiFallback: {
      index: '/demo/index.html'
    },
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      }
    ]
  }
};