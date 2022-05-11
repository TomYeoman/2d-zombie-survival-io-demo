const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const dev = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    https: false,
    historyApiFallback: true,
    allowedHosts: 'all'
  }
}

module.exports = merge(common, dev)
