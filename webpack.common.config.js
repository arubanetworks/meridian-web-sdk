/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const webpack = require("webpack");
const Package = require("./package.json");

const definePlugin = new webpack.DefinePlugin({
  GLOBAL_VERSION: JSON.stringify(Package.version),
});

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        dependency: { not: ["url"] },
        use: [{ loader: "ts-loader" }],
        exclude: /node_modules/,
      },
      {
        use: [
          {
            loader: "file-loader",
            options: { name: "[path][name].[ext]" },
          },
        ],
        type: "javascript/auto",
        include: [path.resolve(__dirname, "files")],
      },
    ],
  },
  plugins: [definePlugin],
  node: {
    __dirname: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
      fs: false, // do not include a polyfill for fs
      path: require.resolve("path-browserify"),
    },
  },
  entry: path.resolve(__dirname, "src/web-sdk.tsx"),
  output: {
    filename: "meridian-sdk.js",
    library: "MeridianSDK",
    libraryTarget: "var",
    publicPath: `https://files.meridianapps.com/meridian-web-sdk/${Package.version}/`,
  },
  devServer: {
    port: 3011,
    devMiddleware: { stats: "errors-only" },
    client: { logging: "error", overlay: true },
    static: { directory: path.resolve(__dirname, "demo"), watch: true },
  },
};
