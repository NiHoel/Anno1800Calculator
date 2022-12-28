const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'calculator.bundle.js',
    charset: true
  },
  module: {
    rules: [{ test: /\.html$/, use: 'html-loader' }],
  },
  optimization: {
	  minimize:true
  },
  resolve: {
    alias: {
        "knockout-amd-helpers": path.join( __dirname, "js/knockout-amd-helpers.min.js" ),
        "knockout": path.join( __dirname, "js/knockout-min.js" ),
    }
}
};