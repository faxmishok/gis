const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    mainMap: path.resolve(__dirname, 'public/mainMap.js'),
  },
  output: {
    path: path.resolve(__dirname, 'public/build/'),
    filename: '[name].min.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
  ],
};

// const path = require('path');
// const Dotenv = require('dotenv-webpack');

// module.exports = {
//   mode: 'production',
//   entry: [path.resolve(__dirname, 'public/javascripts/maps/mainMap.js')],
//   output: {
//     path: path.resolve(__dirname, 'public/javascripts/maps/build/'),
//     filename: '[name].map.js',
//   },
//   devtool: 'source-map',
//   plugins: [new Dotenv()],
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//         },
//       },
//       {
//         test: /\.css$/,
//         use: ['style-loader', 'css-loader'],
//       },
//     ],
//   },
// };
