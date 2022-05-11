const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  entry: ['./client/clientMain.js'],
  resolve: {
    extensions: ['.js']
  },
  module: {
	  rules: [
		{
		  test: /\.(m?js|jsx)$/,
		  exclude: /node_modules/,
		  use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react']
            ]
          }
        }
		}
	]
  },
  plugins: [
    new HtmlPlugin({ gameName: 'Galaxy-Pool', template: 'public/index.html' }),
    new CopyPlugin({
      patterns: [
        { from: 'pwa', to: '' }
    ]
  })
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[id].[chunkhash].js'
  },
}
