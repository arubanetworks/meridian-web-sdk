/* eslint-disable @typescript-eslint/no-var-requires */

const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const Package = require("./package.json");
const common = require("./webpack.common.config");

const definePlugin = new webpack.DefinePlugin({
  GLOBAL_VERSION: JSON.stringify(Package.version),
});

module.exports = {
  ...common,
  plugins: [definePlugin, new BundleAnalyzerPlugin()],
};
