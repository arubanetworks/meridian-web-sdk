import { h, render } from "preact";
import "preact/debug";

import Map from "./Map";

const context = {
  api: null
};

export function init({ api }) {
  context.api = api;
}

export function renderMap(element, options) {
  render(<Map api={context.api} {...options} />, element);
}
