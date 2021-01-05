const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: "production",
  devtool: "hidden-source-map",
  plugins: [new CleanWebpackPlugin()],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  // optimization: {
  //   runtimeChunk: {
  //     name: (entrypoint) => `runtime~${entrypoint.name}`,
  //   },
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //       cacheGroups: {
  //           vendors: {
  //               test: /[\\\/]node_modules[\\\/]/,
  //               name: 'vendors',
  //               chunks: 'all'
  //           }
  //       }
  //   }
  // },
});
