"use strict";

const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const common = {
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
  resolve: {
    alias: {
      d3: path.resolve(__dirname, "src/d3")
    }
  },
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: "meridian-sdk.js",
    library: "MeridianWebSDK",
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

const development = {
  ...common
};

// TODO:
// - `production` should actually be two configurations in an array so we can
//   build a "node" bundle for publishing to npm and a "web" bundle for putting
//   on GCS to be used with a script tag.
// - We should investigate the `node:` key to disable Node polyfills we probably
//   don't need
const production = {
  ...common
};

const analyze = {
  ...common,
  plugins: [new BundleAnalyzerPlugin()]
};

const configs = {
  development,
  production,
  analyze
};

module.exports = env => configs[env];
