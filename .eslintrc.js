module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    sourceType: "module"
  },
  extends: [
    "eslint:recommended",
    "preact",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    curly: "error",
    "spaced-comment": [
      "error",
      "always",
      {
        // Cypress uses `///` comments to load TS types
        markers: ["/"],
        // webpack uses `/*!` comments for license blocks
        exceptions: ["!"]
      }
    ],
    "consistent-return": "error",
    "no-unused-vars": "error",
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-console": "warn",
    "jest/expect-expect": "off",
    "jest/valid-expect-in-promise": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-empty-function": "off"
  }
};
