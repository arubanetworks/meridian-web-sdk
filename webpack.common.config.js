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
        include: [path.resolve(__dirname, "files")],
      },
    ],
  },
  plugins: [definePlugin],
  node: {
    __dirname: true,
    fs: "empty",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  entry: path.resolve(__dirname, "src/web-sdk.tsx"),
  output: {
    filename: "meridian-sdk.js",
    library: "MeridianSDK",
    libraryTarget: "var",
    path: path.resolve(__dirname, "dist"),
    publicPath: `https://files.meridianapps.com/meridian-web-sdk/${Package.version}/`,
  },
  devServer: {
    filename: "meridian-sdk.js",
    clientLogLevel: "error",
    contentBase: path.resolve(__dirname, "demo"),
    overlay: true,
    port: 3011,
    stats: "errors-only",
  },
};
