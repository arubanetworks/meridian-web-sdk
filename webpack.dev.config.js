/* eslint-disable @typescript-eslint/no-var-requires */

const common = require("./webpack.common.config");

module.exports = {
  ...common,
  devtool: "source-map",
  output: {
    ...common.output,
    publicPath: "http://localhost:3011/",
  },
};
