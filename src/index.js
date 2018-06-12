import { h, render } from "preact";
import "preact/debug";

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

export function renderMap(
  element = requiredParam("element"),
  options = requiredParam("options")
) {
  render(<Map api={context.api} {...options} />, element);
}

export function createAPI(options) {
  return new API(options);
}
