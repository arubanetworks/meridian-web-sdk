/*!
 * @license
 * Copyright 2018 Hewlett Packard Enterprise Development LP
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

// This is kinda irritating, but importing package.json just to get the version
// is a waste of kilobytes, so we're using webpack's DefinePlugin to do a macro

/* global GLOBAL_VERSION */

const context = {
  api: null
};

const version = GLOBAL_VERSION;

function restrictedPanZoom({ type, touches, shiftKey }) {
  if (type === "wheel" && !shiftKey) {
    return false;
  } else if (type === "touchstart") {
    return touches.length >= 2;
  }
  return true;
}

function init(
  { api = requiredParam("init", "options.api") } = requiredParam(
    "init",
    "options"
  )
) {
  context.api = api;
}

function createMap(
  node = requiredParam("createMap", "node"),
  options = requiredParam("createMap", "options")
) {
  let mapRef = null;
  const setMapRef = newMapRef => {
    mapRef = newMapRef;
  };
  const update = updatedOptions => {
    options = { ...options, ...updatedOptions };
    domRef = render(
      <Map api={context.api} update={update} {...options} ref={setMapRef} />,
      node,
      domRef
    );
  };
  const zoomToDefault = () => {
    mapRef.zoomToDefault();
  };
  const zoomToPoint = (
    {
      x = requiredParam("map.zoomToPoint.options", "x"),
      y = requiredParam("map.zoomToPoint.options", "y"),
      scale = requiredParam("map.zoomToPoint.options", "scale")
    } = requiredParam("map.zoomToPoint", "options")
  ) => {
    mapRef.zoomToPoint(x, y, scale);
  };
  let domRef = render(
    <Map api={context.api} update={update} {...options} ref={setMapRef} />,
    node
  );
  return { update, zoomToDefault, zoomToPoint };
}

function createAPI(options = requiredParam("createAPI", "options")) {
  return new API(options);
}

// Brian Mock (2018-09-18)
//
// Unfortunately, most people assume that you can use `import MeridianSDK`
// instead of the more correct `import * as MeridianSDK` due to Babel's sloppy
// interop between ES modules and CommonJS. Given that, we're exporting things
// as one big JS object.
export default {
  version,
  init,
  createAPI,
  createMap,
  restrictedPanZoom
};
