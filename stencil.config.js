exports.config = {
  namespace: "meridiancomponents",
  outputTargets: [
    {
      type: "dist"
    },
    {
      type: "www",
      serviceWorker: false
    }
  ],
  enableCache: false
};

exports.devServer = {
  root: "www",
  watchGlob: "**/**"
};
