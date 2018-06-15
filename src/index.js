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
  element = requiredParam("element"),
  options = requiredParam("options")
) {
  let provider = null;
  const ref = element => {
    provider = element;
    provider.setState({ options });
  };
  render(<Provider component={Map} context={context} ref={ref} />, element);
  return {
    update: options => {
      provider.setState(prevState => ({
        options: { ...prevState.options, ...options }
      }));
    }
  };
}

export function createAPI(options) {
  return new API(options);
}
