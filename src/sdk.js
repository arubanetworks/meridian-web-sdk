import { h, render } from "preact";

import Map from "./Map";
import API from "./API";
import { requiredParam } from "./util";

// Wait to load Preact's debug module until the page is loaded since it assumes
// document.body exists, which is not true if someone loads our script in the
// <head> of a document
const loadPreactDebug = () => require("preact/debug");
if (document.readyState === "complete") {
  setTimeout(loadPreactDebug, 0);
} else {
  document.addEventListener("DOMContentLoaded", loadPreactDebug, false);
}

// This is kinda irritating, but importing package.json just to get the version
// is a waste of kilobytes, so we're using webpack's DefinePlugin to do a macro

/* global GLOBAL_VERSION */

const context = {
  api: null
};

export const version = GLOBAL_VERSION;

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

export function createAPI(options = requiredParam("createAPI", "options")) {
  return new API(options);
}
