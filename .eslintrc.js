module.exports = {
  // http://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    browser: true, // DOM globals
    node: true, // Node globals
    es6: true, // allow globals introduced in ES2015 (like Promise)
  },
  // We might want to eventually write modules to wrap these server-injected
  // globals since I'm sure we'll eventually want to move off of them anyway.
  // Then we can just have a file-local globals declaration in those modules
  // and get rid of custom globals being allowed everywhere.
  // globals: {
  //   TIMEZONES: true,
  //   APPVIEWER_VERSIONS: true,
  //   APP_LEVELS: true,
  //   LANGUAGES: true,
  //   CURRENT_VERSION_ID: true,
  //   FRONTEND_VERSIONS: true,
  //   DEPLOYMENT_MODE: true
  // },
  // http://eslint.org/docs/user-guide/configuring#extending-configuration-files
  extends: [
    "eslint:recommended", // http://eslint.org/docs/user-guide/configuring#using-eslintrecommended
    "plugin:react/recommended", // https://github.com/yannickcr/eslint-plugin-react#recommended
  ],
  // http://eslint.org/docs/user-guide/configuring#specifying-parser
  parser: "babel-eslint",
  // http://eslint.org/docs/user-guide/configuring#using-the-configuration-from-a-plugin
  plugins: [
    "babel", // https://github.com/babel/eslint-plugin-babel#eslint-plugin-babel
    "react", // https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules
  ],
  // http://eslint.org/docs/user-guide/configuring#configuring-rules
  rules: {
    curly: "error",
    "consistent-return": "error",
    "react/sort-comp": "error",
    "no-unused-vars": "error",
  },
};
