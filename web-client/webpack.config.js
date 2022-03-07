const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {IgnorePlugin, DefinePlugin} = require('webpack');
const path = require('path');

const env = require('dotenv').config();

if (env.error) {
  throw env.error;
}

const config = {
  mode: process.env.NODE_ENV,

  devtool: process.env.NODE_ENV == 'development' ? 'source-map' : 'none',

  entry: path.resolve(__dirname, 'src/index.js'),

  module: {

    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
        exclude: /node_modules/,
      },

      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader', 'postcss-loader' ]
      }
    ],


  },

  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'serve.json'),
          to: path.resolve(__dirname, 'dist/serve.json'),
        },
        {
          from: path.resolve(__dirname, 'img'),
          to: path.resolve(__dirname, 'dist/img'),
        }
      ]
    }),

    new IgnorePlugin({resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/}),

    new DefinePlugin({
      NODE_ENV: `'${process.env.NODE_ENV}'`,
      SERVER: `'${process.env.SERVER}'`,
    }),

  ],
};

if (process.env.ANALYZE_BUNDLE == 'true') {
  config.plugins.push( new BundleAnalyzerPlugin({ openAnalyzer: false }) );
}

module.exports = config;
