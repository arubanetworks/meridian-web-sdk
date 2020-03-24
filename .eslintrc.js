module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: ["react"],
  rules: {
    curly: "error",
    "consistent-return": "error",
    // "react/sort-comp": "error",
    "no-unused-vars": "error",
    "no-console": 1
  },
  settings: {
    react: {
      pragma: "h"
    }
  }
};
