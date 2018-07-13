// TODO: We should have a license header in the entry file that also gets saved
// in the bundle build

import { h, render } from "preact";
import "preact/debug";

import Map from "./Map";
import API from "./API";
import Package from "../package.json";

const context = {
  api: null
};

function requiredParam(argName) {
  // eslint-disable-next-line no-console
  console.error(`${argName} is required`);
}

export const version = Package.version;

export function init({ api }) {
  context.api = api;
}

export function createMap(
  node = requiredParam("node"),
  options = requiredParam("options")
) {
  let domRef = null;
  let mapRef = null;

  const setMapRef = component => {
    mapRef = component;
  };

  domRef = render(<Map api={context.api} {...options} ref={setMapRef} />, node);

  return {
    update: updatedOptions => {
      options = { ...options, ...updatedOptions };
      domRef = render(
        <Map api={context.api} {...options} ref={setMapRef} />,
        node,
        domRef
      );
    },
    resetZoom: () => {
      mapRef.zoomToDefault();
    }
  };
}

export function createAPI(options) {
  return new API(options);
}
