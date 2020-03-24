/** @jsx h */

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

// TODO: Make this TypeScripty :-)
import { h, render } from "preact";
import axios, { AxiosInstance } from "axios";

import Map from "./Map";
import API, { APIOptions } from "./API";
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

type APIContext = {
  api?: AxiosInstance;
};

const context: APIContext = {
  api: undefined
};

const pixelRatio = window.devicePixelRatio || 1;
const screen = window.screen;
const screenRes = `${screen.width * pixelRatio}x${screen.height * pixelRatio}`;

type SendAnalyticsCodeEventOptions = {
  action: string;
  locationID: string;
  onTagsUpdate?: boolean;
  tagsFilter?: boolean;
  placemarksFilter?: boolean;
  internalUpdate: string;
  youAreHerePlacemarkID?: string;
  destinationID?: string;
};

export async function sendAnalyticsCodeEvent({
  action,
  locationID,
  onTagsUpdate = false,
  tagsFilter = false,
  placemarksFilter = false,
  internalUpdate,
  youAreHerePlacemarkID = undefined,
  destinationID = undefined
}: SendAnalyticsCodeEventOptions) {
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
    cm4: youAreHerePlacemarkID, // Source Placemark ID for Directions
    cm5: destinationID, // Destination Placemark ID for Directions
    ul: navigator.language, // User Language
    sr: screenRes, // Screen Resolution
    aip: 1, // Anonymize IP
    ua: window.navigator.userAgent, // User Agent
    z: Math.random()
      .toString(36)
      .substring(7) // Cache Buster (per google)
  };

  axios.get("https://www.google-analytics.com/collect", { params });
}

export const version = GLOBAL_VERSION;

export function restrictedPanZoom({
  type,
  touches,
  shiftKey
}: TouchEvent & WheelEvent) {
  if (type === "wheel" && !shiftKey) {
    return false;
  } else if (type === "touchstart") {
    return touches.length >= 2;
  }
  return true;
}
type InitOptions = {
  api: AxiosInstance;
};

export function init(options: InitOptions) {
  if (!options) {
    requiredParam("init", "options");
  }
  if (!options.api) {
    requiredParam("init", "options.api");
  }
  context.api = options.api;
}

const MyType = {
  shouldMapPanZoom: PropTypes.func,
  update: PropTypes.func.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  locationID: PropTypes.string.isRequired,
  floorID: PropTypes.string.isRequired,
  youAreHerePlacemarkID: PropTypes.string,
  api: PropTypes.object,
  showFloorsControl: PropTypes.bool,
  showTagsControl: PropTypes.bool,
  tags: PropTypes.shape({
    showControlTags: PropTypes.bool,
    filter: PropTypes.func,
    disabled: PropTypes.bool
  }),
  placemarks: PropTypes.shape({
    showHiddenPlacemarks: PropTypes.bool,
    filter: PropTypes.func,
    disabled: PropTypes.bool
  }),
  onMarkerClick: PropTypes.func,
  onTagClick: PropTypes.func,
  onPlacemarkClick: PropTypes.func,
  onMapClick: PropTypes.func,
  onTagsUpdate: PropTypes.func,
  onFloorsUpdate: PropTypes.func,
  onMapUpdate: PropTypes.func
};

export function createMap(
  node = requiredParam("createMap", "node"),
  options = requiredParam("createMap", "options")
) {
  let mapRef: HTMLElement | null = null;
  const setMapRef = (newMapRef: HTMLElement) => {
    mapRef = newMapRef;
  };
  const _update = (updatedOptions, { internalUpdate = true } = {}) => {
    options = { ...options, ...updatedOptions };
    domRef = render(
      <Map api={context.api} update={_update} {...options} ref={setMapRef} />,
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
  const update = updatedOptions => {
    _update(updatedOptions, { internalUpdate: false });
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
    <Map api={context.api} update={_update} {...options} ref={setMapRef} />,
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

export function createAPI(options: APIOptions) {
  if (!options) {
    requiredParam("createAPI", "options");
  }
  return new API(options);
}
