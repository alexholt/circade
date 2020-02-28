const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,

  entry: path.resolve(__dirname, 'src/index.js'),

  module: {

    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
        exclude: /node_modules/,
      },

      {
        test: /\.css$/,
        use: [ 'style-loader', 'postcss-loader' ]
      }
    ],


  },

  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'img'),
      to: path.resolve(__dirname, 'dist/img'),
    }]),
  ],
};
