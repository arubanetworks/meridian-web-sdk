import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3011",
    setupNodeEvents(_on, _config) {
      // bind to the event we care about
      // on("<event>", (arg1, arg2) => {
      // plugin stuff here
      // });
    },
  },
});
