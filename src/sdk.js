import { h, render } from "preact";
import axios from "axios";

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

async function sendAnalyticsCodeEvent({
  action,
  locationID,
  onTagsUpdate = false,
  tagsFilter = false,
  placemarksFilter = false,
  internalUpdate
}) {
  const data = {
    aip: 1,
    v: "1",
    tid: "UA-56747301-5",
    an: "MeridianSDK",
    av: "0.0.3",
    uid: locationID,
    cid: locationID,
    t: "event",
    ds: "app",
    ec: "code",
    ea: action,
    el: internalUpdate ? "internal" : "external",
    cm1: onTagsUpdate ? 1 : 0,
    cm2: tagsFilter ? 1 : 0,
    cm3: placemarksFilter ? 1 : 0,
    ul: navigator.language,
    z: Math.random()
      .toString(36)
      .substring(7), // cache buster per google
    ua: window.navigator.userAgent
  };

  axios
    .get("http://www.google-analytics.com/collect", {
      params: {
        ...data
      }
    })
    .then(response => {
      console.info(response.status);
      console.info(response.config.params);
    });
}

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
  const update = (updatedOptions, internalUpdate = false) => {
    options = { ...options, ...updatedOptions };
    domRef = render(
      <Map api={context.api} update={update} {...options} ref={setMapRef} />,
      node,
      domRef
    );
    sendAnalyticsCodeEvent({
      action: "map.update",
      locationID: options.locationID,
      onTagsUpdate: !!options.onTagsUpdate,
      tagsFilter: !!(options.tags && options.tags.filter),
      placemarksFilter: !!(options.placemarks && options.placemarks.filter),
      internalUpdate
    });
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
  sendAnalyticsCodeEvent({
    action: "createMap",
    locationID: options.locationID,
    onTagsUpdate: !!options.onTagsUpdate,
    tagsFilter: !!(options.tags && options.tags.filter),
    placemarksFilter: !!(options.placemarks && options.placemarks.filter)
  });
  return { update, zoomToDefault, zoomToPoint };
}

export function createAPI(options = requiredParam("createAPI", "options")) {
  return new API(options);
}
