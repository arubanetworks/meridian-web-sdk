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

const pixelRatio = window.devicePixelRatio || 1;
const screen = window.screen;
const screenRes = `${screen.width * pixelRatio}x${screen.height * pixelRatio}`;

async function sendAnalyticsCodeEvent({
  action,
  locationID,
  onTagsUpdate = false,
  tagsFilter = false,
  placemarksFilter = false,
  internalUpdate
}) {
  const params = {
    v: "1", // GA version
    tid: "UA-56747301-5", // Tracking ID
    an: "MeridianSDK", // Application Name
    ds: "app", // Data Source
    av: GLOBAL_VERSION, // Application Version
    uid: locationID, // User ID
    cid: locationID, // Client ID
    t: "event", // Hit Type
    ec: "code", // Event Category
    ea: action, // Event Action
    ev: 1, // Event Value
    el: internalUpdate ? "internal" : "external", // Event Label
    cm1: onTagsUpdate ? 1 : 0, // Custom Metric
    cm2: tagsFilter ? 1 : 0, // Custom Metric
    cm3: placemarksFilter ? 1 : 0, // Custom Metric
    ul: navigator.language, // User Language
    sr: screenRes, // Screen Resolution
    aip: 1, // Anonymize IP
    ua: window.navigator.userAgent, // User Agent
    z: Math.random()
      .toString(36)
      .substring(7) // Cache Buster (per google)
  };

  axios.get("http://www.google-analytics.com/collect", { params });
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
      onTagsUpdate: Boolean(options.onTagsUpdate),
      tagsFilter: Boolean(options.tags && options.tags.filter),
      placemarksFilter: Boolean(
        options.placemarks && options.placemarks.filter
      ),
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
    onTagsUpdate: Boolean(options.onTagsUpdate),
    tagsFilter: Boolean(options.tags && options.tags.filter),
    placemarksFilter: Boolean(options.placemarks && options.placemarks.filter)
  });
  return { update, zoomToDefault, zoomToPoint };
}

export function createAPI(options = requiredParam("createAPI", "options")) {
  return new API(options);
}
