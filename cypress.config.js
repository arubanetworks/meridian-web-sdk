const { defineConfig } = require("cypress");

module.exports = defineConfig({
  $schema: "https://on.cypress.io/cypress.schema.json",
  video: false,
  e2e: {
    baseUrl: "http://localhost:3001",
    supportFile: false,
    setupNodeEvents(on, config) {
      // e2e testing node events setup code
    },
  },
});
