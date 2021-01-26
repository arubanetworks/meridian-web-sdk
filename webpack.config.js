/* eslint-disable @typescript-eslint/no-var-requires */
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
        test: /\.(js|ts|tsx)$/,
        use: [{ loader: "ts-loader" }],
        exclude: /node_modules/
      },
      {
        use: [
          {
            loader: "file-loader",
            options: { name: "[path][name].[ext]" }
          }
        ],
        include: [path.resolve(__dirname, "files")]
      }
    ]
  },
  plugins: [definePlugin],
  node: {
    __dirname: true,
    fs: "empty"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  entry: path.resolve(__dirname, "src/web-sdk.tsx"),
  output: {
    filename: "meridian-sdk.js",
    library: "MeridianSDK",
    libraryTarget: "var",
    path: path.resolve(__dirname, "dist"),
    publicPath: `https://files.meridianapps.com/meridian-web-sdk/${Package.version}/`
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
    filename: "web-sdk.js",
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "dist"),
    publicPath: `https://files.meridianapps.com/meridian-web-sdk/${Package.version}/`
  },
  target: "node",
  externals: [nodeExternals()]
};

const development = {
  ...common,
  devtool: "source-map",
  output: {
    ...common.output,
    publicPath: "http://localhost:3011/"
  }
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
