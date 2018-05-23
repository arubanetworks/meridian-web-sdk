import { h, render } from "preact";

import Map from "./Map";

export function createMap(element, options) {
  render(<Map {...options} />, element);
}
