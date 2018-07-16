// TODO: We should have a license header in the entry file that also gets saved
// in the bundle build

import { h, render } from "preact";
import "preact/debug";

import Map from "./Map";
import API from "./API";
import { requiredParam } from "./util";
import Package from "../package.json";

const context = {
  api: null
};

export const version = Package.version;

export function init({ api } = requiredParam("init", "options")) {
  context.api = api;
}

export function createMap(
  node = requiredParam("createMap", "node"),
  options = requiredParam("createMap", "options")
) {
  let domRef = render(<Map api={context.api} {...options} />, node);
  return {
    update: updatedOptions => {
      options = { ...options, ...updatedOptions };
      domRef = render(<Map api={context.api} {...options} />, node, domRef);
    }
  };
}

export function createAPI(options = requiredParam("createAPI", "options")) {
  return new API(options);
}
