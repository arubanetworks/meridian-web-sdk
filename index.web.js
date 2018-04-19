import App from "./App";
import { AppRegistry } from "react-native";

AppRegistry.registerComponent("App", () => App);

AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("web-app"),
});

// Alternate way to render component in existing app
// import React from "react";
// import { render } from "react-native";
// render(<App />, document.getElementById("web-app"));
