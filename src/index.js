import { h, render } from "preact";
import "preact/debug";

import Provider from "./Provider";
import Map from "./Map";
import API from "./API";

const context = {
  api: null
};

function requiredParam(argName) {
  console.error(`${argName} is required`);
}

export function init({ api }) {
  context.api = api;
}

export function createMap(
  targetElement = requiredParam("targetElement"),
  options = requiredParam("options")
) {
  let theProvider = null;
  const ref = theComponent => {
    theProvider = theComponent;
    theProvider.setState({ options });
  };
  render(
    <Provider component={Map} context={context} ref={ref} />,
    targetElement
  );
  return {
    update: options => {
      theProvider.setState(prevState => ({
        options: { ...prevState.options, ...options }
      }));
    }
  };
}

export function createAPI(options) {
  return new API(options);
}
