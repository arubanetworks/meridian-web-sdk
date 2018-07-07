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

  domRef = render(<Map api={context.api} {...options} />, node);

  return {
    update: updatedOptions => {
      options = { ...options, ...updatedOptions };
      domRef = render(<Map api={context.api} {...options} />, node, domRef);
    }
  };
}

export function createAPI(options) {
  return new API(options);
}
