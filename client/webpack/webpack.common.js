const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const AssetsPlugin = require("assets-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    app: "./src/App.jsx",
    vendor: [
      "react",
      "react-dom",
      "@inertiajs/inertia",
      "@inertiajs/inertia-react",
      "styled-components",
      "@inertiajs/progress/src",
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, "..", "..", "public", "assets"),
    // filename: "[name].[hash].js",
    filename: "[name].js",
    chunkFilename: "js/[name].js?id=[chunkhash]",
    publicPath: process.env.BASE_URL,
  },
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new AssetsPlugin({
      filename: "assets.json",
      path: path.resolve(__dirname, "..", "..", "public", "assets"),
      removeFullPathAutoPrefix: true,
    }),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["!images/**/*"],
    }),
  ],
};