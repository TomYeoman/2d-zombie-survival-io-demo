const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const WebpackObfuscator = require('webpack-obfuscator')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const prod = {
  mode: 'production',
  optimization: {
	  minimize: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackObfuscator(
      {
        rotateStringArray: true,
        stringArray: true,
        // stringArrayEncoding: 'base64', // disabled by default
        stringArrayThreshold: 0.75
      },
      ['vendors.*.js']
    )
  ],
  output: {
    filename: '[name].[fullhash].bundle.js',
    chunkFilename: '[name].[chunkhash].chunk.js'
  },
}

module.exports = merge(common, prod)
