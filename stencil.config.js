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
  ],
  globalStyle: "src/global/style.scss"
};

exports.devServer = {
  root: "www",
  watchGlob: "**/**"
};
