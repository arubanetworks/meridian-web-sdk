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
              // This setting seems to trigger the issue
              inline: "no-fallback",
            },
          },
        ],
      },
    ],
  },
  entry: path.resolve(__dirname, "src/main.js"),
};
