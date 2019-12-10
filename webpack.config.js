"use strict";

const path = require("path");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const nodeExternals = require("webpack-node-externals");

const Package = require("./package.json");

const definePlugin = new webpack.DefinePlugin({
  GLOBAL_VERSION: JSON.stringify(Package.version)
});

const common = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.ts?$/,
        use: [{ loader: "ts-loader" }],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [definePlugin],
  node: {
    __dirname: true,
    fs: "empty"
  },
  resolve: {
    extensions: [".ts", ".ts", ".js"],
    alias: {
      d3: path.resolve(__dirname, "src/d3")
    }
  },
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: "meridian-sdk.js",
    library: "MeridianSDK",
    libraryTarget: "var",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    filename: "meridian-sdk.js",
    clientLogLevel: "error",
    contentBase: path.resolve(__dirname, "demo"),
    overlay: true,
    port: 3011,
    stats: "errors-only"
  }
};

// This bundles our code into one file but avoids bundling everything in
// node_modules, so that consumers can use us like a normal npm package
const npmConfig = {
  ...common,
  output: {
    filename: "index.js",
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "dist")
  },
  target: "node",
  externals: [nodeExternals()]
};

const development = {
  ...common
};

// Build the browser JS bundle as well as the npm bundle
const production = [common, npmConfig];

const analyze = {
  ...common,
  plugins: [definePlugin, new BundleAnalyzerPlugin()]
};

const configs = {
  development,
  production,
  analyze
};

module.exports = env => configs[env];
