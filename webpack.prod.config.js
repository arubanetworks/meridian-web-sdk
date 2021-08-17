/* eslint-disable @typescript-eslint/no-var-requires */

const nodeExternals = require("webpack-node-externals");
const Package = require("./package.json");
const common = require("./webpack.common.config");

// This bundles our code into one file but avoids bundling everything in
// node_modules, so that consumers can use us like a normal npm package
const npmConfig = {
  ...common,
  mode: "production",
  output: {
    filename: "web-sdk.js",
    libraryTarget: "commonjs",
    publicPath: `https://files.meridianapps.com/meridian-web-sdk/${Package.version}/`,
  },
  target: "node",
  externals: [nodeExternals()],
};

module.exports = [common, npmConfig];
