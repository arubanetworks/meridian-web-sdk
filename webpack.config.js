const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: [
          {
            loader: "worker-loader",
            options: {
              inline: "no-fallback",
            },
          },
        ],
      },
    ],
  },
  entry: path.resolve(__dirname, "src/main.js"),
};
