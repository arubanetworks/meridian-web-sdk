"use strict";

const path = require("path");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = env => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  node: {
    __dirname: true,
    fs: "empty"
  },
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: "mwc.js",
    library: "MeridianWebComponents",
    libraryTarget: "var",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    filename: "mwc.js",
    clientLogLevel: "error",
    contentBase: path.resolve(__dirname, "demo"),
    overlay: true,
    port: 3011,
    stats: "errors-only"
  },
  plugins: env === "production" ? [new BundleAnalyzerPlugin()] : []
});
