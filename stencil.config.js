const sass = require("@stencil/sass");

exports.config = {
  plugins: [sass()],
  namespace: "mycomponent",
  outputTargets: [
    {
      type: "dist"
    },
    {
      type: "www",
      serviceWorker: false
    }
  ]
};

exports.devServer = {
  root: "www",
  watchGlob: "**/**"
};
