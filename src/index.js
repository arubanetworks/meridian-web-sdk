import { h, render } from "preact";
import "preact/debug";

import Map from "./Map";
import API from "./API";

const context = {
  api: null
};

function requiredParam(argName) {
  // eslint-disable-next-line no-console
  console.error(`${argName} is required`);
}

export function init({ api }) {
  context.api = api;
}

export function createMap(
  node = requiredParam("node"),
  options = requiredParam("options")
) {
  let mapRef = null;

  const ref = component => {
    mapRef = component;
  };

  render(<Map api={context.api} {...options} ref={ref} />, node);

  return {
    update: updatedOptions => {
      options = { ...options, ...updatedOptions };
      render(
        <Map api={context.api} {...options} ref={ref} />,
        node,
        mapRef.base
      );
    }
  };
}

export function createAPI(options) {
  return new API(options);
}
