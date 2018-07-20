/*!
 * @license
 * Copyright 2018 Aruba, a Hewlett Packard Enterprise Company
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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

export function restrictedPanZoom({ type, touches, shiftKey }) {
  if (type === "wheel" && !shiftKey) {
    return false;
  } else if (type === "touchstart") {
    return touches.length >= 2;
  }
  return true;
}

export function init(
  { api = requiredParam("init", "options.api") } = requiredParam(
    "init",
    "options"
  )
) {
  context.api = api;
}

export function createMap(
  node = requiredParam("createMap", "node"),
  options = requiredParam("createMap", "options")
) {
  const update = updatedOptions => {
    options = { ...options, ...updatedOptions };
    domRef = render(
      <Map api={context.api} update={update} {...options} />,
      node,
      domRef
    );
  };
  let domRef = render(
    <Map api={context.api} update={update} {...options} />,
    node
  );
  return { update };
}

export function createAPI(options = requiredParam("createAPI", "options")) {
  return new API(options);
}
