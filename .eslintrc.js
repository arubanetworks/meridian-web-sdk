module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parser: "babel-eslint",
  plugins: ["babel", "react"],
  rules: {
    curly: "error",
    "consistent-return": "error",
    "react/sort-comp": "error",
    "no-unused-vars": "error"
  }
};
