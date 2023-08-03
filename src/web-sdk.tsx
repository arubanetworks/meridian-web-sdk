/** @jsx h */

/*!
 * @license
 * Copyright 2022 Hewlett Packard Enterprise Development LP
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

/**
 * See {@link init} and {@link createMap} for getting started.
 *
 * ```js
 * const api = new MeridianSDK.API({ token: "<TOKEN>" });
 * const map = MeridianSDK.createMap(
 *  document.querySelector("#map-container"),
 *  {
 *    api: api,
 *    locationID: "<location ID>",
 *    floorID: "<floor ID>",
 *    height: "500px"
 *  }
 * );
 * ```
 *
 * Call this before navigating to a new page, to close network connections. This
 * is critical for usage within a single page application, or even just an
 * interactive page with JS that unmounts the map container element (e.g.
 * removing it from the DOM or setting the `innerHTML`).
 *
 * ```js
 * map.destroy();
 * ```
 * @packageDocumentation
 */

import axios, { AxiosInstance } from "axios";
import path from "path";
import { h, render } from "preact";
import ReconnectingWebSocket from "reconnecting-websocket";
import placemarkIconGeneric from "../files/placemarks/generic.svg";
import { sendAnalyticsCodeEvent } from "./analytics";
import MapComponent from "./MapComponent";
import { LanguageCodes } from "./Translations";
import {
  asyncClientCall,
  logDeprecated,
  logError,
  requiredParam,
} from "./util";

/** @internal */
const placemarkFiles = require.context("../files/placemarks", false, /\.svg$/);
/** @internal */
const placemarkIcons: Map<string, string> = new Map();
for (const filename of placemarkFiles.keys()) {
  const name = path.basename(filename, ".svg");
  const url = placemarkFiles(filename).default;
  placemarkIcons.set(name, url);
}

/**
 * Takes a placemark type and returns a URL to a white SVG icon representing it
 *
 * @example
 * ```ts
 * function onPlacemarkClick(placemark) {
 *   const url = MeridianSDK.placemarkIconURL(placemark.type);
 *   console.log(url);
 * }
 * ```
 */
export function placemarkIconURL(type: string): string {
  if (!type || type.startsWith("label_")) {
    return placemarkIconGeneric;
  }
  const url = placemarkIcons.get(type);
  if (!url) {
    logError(`placemarkIconURL: no such icon '${type}'`);
    return placemarkIconGeneric;
  }
  return url;
}

/**
 * Returns an array of points (numbers) based on a placemarks's area property
 */
export function pointsFromArea(area: string | null | undefined): number[] {
  if (!area) {
    return [];
  }
  return area.split(",").map(Number);
}

// Wait to load Preact's debug module until the page is loaded since it assumes
// document.body exists, which is not true if someone loads our script in the
// <head> of a document
/** @internal */
const loadPreactDebug = () => require("preact/debug");
if (document.readyState === "complete") {
  setTimeout(loadPreactDebug, 0);
} else {
  document.addEventListener("DOMContentLoaded", loadPreactDebug, false);
}

/** @internal */
interface APIContext {
  api?: API;
}

/** @internal */
const context: APIContext = {
  api: undefined,
};

// This is kinda irritating, but importing package.json just to get the version
// is a waste of kilobytes, so we're using webpack's DefinePlugin to do a macro
/** @internal */
declare const GLOBAL_VERSION: string;

/**
 * The current version of the Meridian Web SDK. Useful for checking which
 * version is running.
 *
 * ```js
 * console.log(MeridianSDK.version);
 * ```
 */
export const version: string = GLOBAL_VERSION;

/**
 * This function can be used to restrict pan/zoom events unless the user is
 * holding down a modifier key (Control, Alt, Command, Shift) on their keyboard.
 * This prevents accidental map interactions in pages with lots of scrolling
 * content.
 *
 * Pass this to `shouldMapPanZoom` in {@link createMap} if you would like the user
 * to use two fingers or hold down a modifier key in order to zoom the map.
 *
 * ```js
 * const api = new MeridianSDK.API({ token: "<TOKEN>" });
 *
 * const map = MeridianSDK.createMap(
 *  document.querySelector("#map-container"),
 *  {
 *    api,
 *    locationID: "<location ID>",
 *    floorID: "<floor ID>",
 *    height: "500px",
 *    shouldMapPanZoom: MeridianSDK.restrictedPanZoom,
 *  }
 * )
 * ```
 */
export function restrictedPanZoom(event: any): boolean {
  if (event.type === "wheel") {
    return event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
  } else if (event.type === "touch") {
    return event.touches.length >= 2;
  }
  return true;
}

/**
 * Object with a lat, lng, x, y, globalX, globalY for conversion of lat/lng positioning to x/y positioning
 */

type refPoint = {
  lat: number;
  lng: number;
  x: number;
  y: number;
  globalCoordinateX?: number;
  globalCoordinateY?: number;
};

/**
 * Convert from latitude and longitude to a point on a referenced map. Uses equirectangular projection.
 *
 * The basic formula to achieve this is as follows:
 *
 * x = radius(longitude - central meridian of map) * cos(standard parallels with scale)
 *
 * y = radius(latitude - central parallel of map)
 *
 */

export function latLngToMapPoint(
  floorData: Partial<FloorData>,
  { lat, lng }: { lat: number; lng: number }
) {
  const latToConvert = lat;
  const lngToConvert = lng;
  const anchorPointsArray: number[] = [];

  floorData.gps_ref_points.split(",").forEach((item: string) => {
    anchorPointsArray.push(Number(item));
  });

  /** Break up a map's gps_ref_points into two objects we can then
   * use to calculate map points
   */
  const refPoint1: refPoint = {
    lat: anchorPointsArray[0],
    lng: anchorPointsArray[1],
    x: anchorPointsArray[4],
    y: anchorPointsArray[5],
  };
  const refPoint2: refPoint = {
    lat: anchorPointsArray[2],
    lng: anchorPointsArray[3],
    x: anchorPointsArray[6],
    y: anchorPointsArray[7],
  };

  const earthRadius = 6371;

  /** Convert the Anchor Point lat/lng points to a coordinate x/y for each gps_ref_point
   * cos(lat) is how we can construct a 2D image from a 3D, real-world measurement.
   * below we take the average of the cos(lat) of both gps_ref_points because these
   * formulas are not exact
   */
  refPoint1.globalCoordinateX =
    earthRadius * refPoint1.lng * Math.cos((refPoint1.lat + refPoint2.lat) / 2);
  refPoint1.globalCoordinateY = earthRadius * refPoint1.lat;

  refPoint2.globalCoordinateX =
    earthRadius * refPoint2.lng * Math.cos((refPoint1.lat + refPoint2.lat) / 2);
  refPoint2.globalCoordinateY = earthRadius * refPoint2.lat;

  // Calculate the x/y on a global scale for the lat/lng points we wish to convert
  const globalPointX =
    earthRadius * lngToConvert * Math.cos((refPoint1.lat + refPoint2.lat) / 2);
  const globalPointY = earthRadius * latToConvert;

  /** Now we calculate the percentage of Global x/y position vs global width/height
   * The visual representation of this is as follows (calculating for xPercentage):
   * |+++++++++++++++++++ [refPoint2.X - refPoint1.X] +++++++++++++++++++|
   * |++ [globalPointX - refPoint1.X] ++| |++ refPoint2.X globalPointX ++|
   * */
  const xPercentage =
    (globalPointX - refPoint1.globalCoordinateX) /
    (refPoint2.globalCoordinateX - refPoint1.globalCoordinateX);
  const yPercentage =
    (globalPointY - refPoint1.globalCoordinateY) /
    (refPoint2.globalCoordinateY - refPoint1.globalCoordinateY);

  /** Similar visual representation as above - figuring out the map placement based
   * on reference point screen position
   */

  const mapPointX = refPoint1.x + (refPoint2.x - refPoint1.x) * xPercentage;
  const mapPointY = refPoint1.y + (refPoint2.y - refPoint1.y) * yPercentage;

  return { x: mapPointX, y: mapPointY };
}

/**
 * Convert from a point on a referenced map to latitude and longitude. Uses mercator projection.
 *
 * The basic formula to achieve this is as follows:
 *
 * latitute = 2(tan^-1)[exp(y / radius)]
 * longitude = central parallel of map + (x / radius) - PI / 2
 *
 */

export function mapPointToLatLng(
  floorData: Partial<FloorData>,
  { x, y }: { x: number; y: number }
) {
  const anchorPointsArray: number[] = [];

  floorData.gps_ref_points.split(",").forEach((item: string) => {
    anchorPointsArray.push(Number(item));
  });

  /** Break up a map's gps_ref_points into two objects we can then
   * use to calculate map points
   */
  const refPoint1: refPoint = {
    lat: anchorPointsArray[0],
    lng: anchorPointsArray[1],
    x: anchorPointsArray[4],
    y: anchorPointsArray[5],
  };
  const refPoint2: refPoint = {
    lat: anchorPointsArray[2],
    lng: anchorPointsArray[3],
    x: anchorPointsArray[6],
    y: anchorPointsArray[7],
  };

  /**
   * The farthest most left and right longitude of the provided map
   */
  const mapLngLeft = refPoint1.lng;
  const mapLngRight = refPoint2.lng;
  const mapLonDelta = mapLngRight - mapLngLeft;

  /** We need the bottom latitude of the map to do these calculations, however we don't
   * immediately know which reference point is the lowest reference point. So we look at
   * the reference point screen x,y data to see which point is lower. We can then use the
   * latitude of that reference point as the bottom latitude.
   */
  function findBottomLat() {
    let theBottomLat;
    if (refPoint1.y < refPoint2.y) {
      theBottomLat = refPoint2.lat;
    } else {
      theBottomLat = refPoint1.lat;
    }
    return theBottomLat;
  }
  const mapLatBottom = findBottomLat();
  const mapLatBottomRadian = (mapLatBottom * Math.PI) / 180;
  const worldMapRadius: number =
    ((floorData.width / mapLonDelta) * 360) / (2 * Math.PI);

  /**
   * Here we figure out where the map is globally and preserve a conformal map projection
   */
  const parallelOffset: number =
    (worldMapRadius / 2) *
    Math.log(
      (1 + Math.sin(mapLatBottomRadian)) / (1 - Math.sin(mapLatBottomRadian))
    );
  const mapOffset: number =
    (floorData.height + parallelOffset - y) / worldMapRadius;

  const mapPointLat: number =
    (180 / Math.PI) * (2 * Math.atan(Math.exp(mapOffset)) - Math.PI / 2);
  const mapPointLng: number = mapLngLeft + (x / floorData.width) * mapLonDelta;

  return { lat: mapPointLat, lng: mapPointLng };
}

/**
 * Initializes a share MeridianSDK API instance for use across all calls to
 * {@link createMap}. You can either call this function or pass your {@link API}
 * instance directly to {@link createMap}.
 *
 * ```js
 * const api = new MeridianSDK.API({
 *   token: "<TOKEN GOES HERE>"
 * });
 *
 * MeridianSDK.init({ api: api });
 * ```
 */
export function init(options: { api: API }): void {
  if (!options) {
    requiredParam("init", "options");
  }
  if (!options.api) {
    requiredParam("init", "options.api");
  }
  context.api = options.api;
}

export interface CreateMapTagsOptions {
  /** Should we show control tags? Defaults to `false`. */
  showControlTags?: boolean;
  /**
   * Filter function used to hide tags. Return `false` to hide a tag. Defaults
   * to `() => true`.
   */
  filter?: (tag: TagData) => boolean;
  /** Disable clicking tags when `true`. Defaults to `false`. */
  disabled?: boolean;
  /** Update interval in milliseconds, defaults to 5000 */
  updateInterval?: number;
}

export interface CreateMapPlacemarksOptions {
  /** Should we show hidden placemarks? Defaults to `false`. */
  showHiddenPlacemarks?: boolean;
  /**
   * Filter function used to hide placemarks. Return `false` to hide a
   * placemark. Defaults to `() => true`.
   */
  filter?: (placemark: PlacemarkData) => boolean;
  /** Disable clicking placemarks when `true`. Defaults to `false`. */
  disabled?: boolean;
  /**
   * Which mode should we use for displaying placemark labels
   *
   * - always: shown at all times regardless of zoom level
   * - never: never shown
   * - hover: only shown when the placemark is hovered
   * - zoom: [default] only shown when a certain zoom level is reached
   */
  labelMode?: "always" | "never" | "hover" | "zoom";
  /** Zoom level at which placemark lables appear when label mode is "zoom" */
  labelZoomLevel?: number;
}

/**
 * Object describing an SVG `<polygon>` element drawn on the map
 *
 * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polygon>
 */
export interface CustomOverlayPolygon {
  type: "polygon";
  /**
   * `true` will result in the element being wrapped in a `<defs>` (default: `false`)
   *
   * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs>
   */
  defs?: boolean;
  id?: string;
  className?: string;
  style?: h.JSX.CSSProperties;
  points: number[];
  fill?: string;
  fillOpacity?: number | string;
  stroke?: string;
  strokeWidth?: number;
  strokeLineJoin?: "miter" | "round";
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeOpacity?: number | string;
  markerStart: string;
  markerMid: string;
  markerEnd: string;
  animate?: h.JSX.SVGAttributes<SVGAnimateElement>;
  /** Arbitrary data for use with onClick handler */
  data?: Record<string, any>;
  onClick?: (data: Record<string, any>) => void;
}

/**
 * Object describing an SVG `<polyline>` element drawn on the map
 *
 * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline>
 */
export interface CustomOverlayPolyline {
  type: "polyline";
  /**
   * `true` will result in the element being wrapped in a `<defs>` (default: `false`)
   *
   * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs>
   */
  defs?: boolean;
  id?: string;
  className?: string;
  style?: h.JSX.CSSProperties;
  points: number[];
  fill?: string;
  fillOpacity?: number | string;
  stroke?: string;
  strokeWidth?: number;
  strokeLineJoin?: "miter" | "round";
  strokeLineCap?: "butt" | "round" | "square";
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeOpacity?: number | string;
  markerStart: string;
  markerMid: string;
  markerEnd: string;
  animate?: h.JSX.SVGAttributes<SVGAnimateElement>;
}

/**
 * Object describing an SVG `<path>` element drawn on the map
 *
 * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path>
 */
export interface CustomOverlayPath {
  type: "path";
  /**
   * `true` will result in the element being wrapped in a `<defs>` (default: `false`)
   *
   * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs>
   */
  defs?: boolean;
  id?: string;
  className?: string;
  style?: h.JSX.CSSProperties;
  shape: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLineJoin?: "miter" | "round";
  strokeLineCap?: "butt" | "round" | "square";
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeOpacity?: number | string;
  markerStart: string;
  markerMid: string;
  markerEnd: string;
  animate?: h.JSX.SVGAttributes<SVGAnimateElement>;
  animateMotion?: h.JSX.SVGAttributes<SVGAnimateMotionElement>;
  mpath?: SVGMPathElement;
}

/**
 * Object describing an SVG `<circle>` element drawn on the map
 *
 * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle>
 */
export interface CustomOverlayCircle {
  type: "circle";
  /**
   * `true` will result in the element being wrapped in a `<defs>` (default: `false`)
   *
   * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs>
   */
  defs?: boolean;
  id?: string;
  className?: string;
  style?: h.JSX.CSSProperties;
  cx: string;
  cy: string;
  r: string;
  pathLength: number;
  fill?: string;
  fillOpacity?: number | string;
  stroke?: string;
  strokeWidth?: number;
  strokeLineJoin?: "miter" | "round";
  strokeLineCap?: "butt" | "round" | "square";
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeOpacity?: number | string;
  animate?: h.JSX.SVGAttributes<SVGAnimateElement>;
  animateMotion?: h.JSX.SVGAttributes<SVGAnimateMotionElement>;
  mpath?: SVGMPathElement;
  /** Arbitrary data for use with onClick handler */
  data?: Record<string, any>;
  onClick?: (data: Record<string, any>) => void;
}

/**
 * Object describing an SVG `<image>` element drawn on the map
 *
 * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image>
 */
export interface CustomOverlayImage {
  type: "image";
  /**
   * `true` will result in the element being wrapped in a `<defs>` (default: `false`)
   *
   * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs>
   */
  defs?: boolean;
  id?: string;
  className?: string;
  style?: h.JSX.CSSProperties;
  x?: number;
  y?: number;
  width: number;
  height: number;
  href: string;
  animateMotion?: h.JSX.SVGAttributes<SVGAnimateMotionElement>;
  animate?: h.JSX.SVGAttributes<SVGAnimateElement>;
  mpath?: SVGMPathElement;
  /** Arbitrary data for use with onClick handler */
  data?: Record<string, any>;
  onClick?: (data: Record<string, any>) => void;
}

/**
 * Object describing an SVG `<marker>` element drawn on the map
 *
 * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker>
 */
export interface CustomOverlayMarker {
  type: "marker";
  /**
   * `true` will result in the element being wrapped in a `<defs>` (default: `false`)
   *
   * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs>
   */
  defs?: boolean;
  id?: string;
  className?: string;
  style?: h.JSX.CSSProperties;
  viewBox: string;
  refX: string;
  refY: string;
  markerWidth: number;
  markerHeight: number;
  orient: string;
  fill?: string;
  fillOpacity?: number | string;
  stroke?: string;
  strokeWidth?: number;
  strokeLineJoin?: "miter" | "round";
  strokeLineCap?: "butt" | "round" | "square";
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeOpacity?: number | string;
  shapeElementType: "circle" | "polygon" | "polyline" | "path" | "image";
  shapeElementAttributes: Record<string, any>;
}

/**
 * Object describing an SVG `<use>` element drawn on the map.
 *
 * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use>
 */
export interface CustomOverlayUse {
  type: "use";
  /**
   * `true` will result in the element being wrapped in a `<defs>` (default: `false`)
   *
   * <https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs>
   */
  defs?: boolean;
  id?: string;
  className?: string;
  style?: h.JSX.CSSProperties;
  x?: number;
  y?: number;
  width: number;
  height: number;
  href: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLineJoin?: "miter" | "round";
  strokeLineCap?: "butt" | "round" | "square";
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeOpacity?: number | string;
  animate?: h.JSX.SVGAttributes<SVGAnimateElement>;
  animateMotion?: h.JSX.SVGAttributes<SVGAnimateMotionElement>;
  mpath?: SVGMPathElement;
}

/**
 * Object describing a custom overlay
 */
export type CustomOverlay =
  | CustomOverlayImage
  | CustomOverlayPath
  | CustomOverlayPolygon
  | CustomOverlayPolyline
  | CustomOverlayCircle
  | CustomOverlayMarker
  | CustomOverlayUse;

/**
 * Object describing a point annotation drawn on the map
 */
export interface CustomAnnotationPoint {
  type: "point";
  x: number;
  y: number;
  size?: number;
  backgroundColor?: string;
  backgroundSize?: string;
  backgroundImage?: string;
  title?: string;
  /** Arbitrary data for use with onClick handler */
  data?: Record<string, any>;
  onClick?: (data: Record<string, any>) => void;
}

/**
 * Object describing a custom annotation
 */
export type CustomAnnotation = CustomAnnotationPoint;

/**
 * Options passed to {@link createMap}.
 */
export interface CreateMapOptions {
  /** See {@link restrictedPanZoom}. */
  shouldMapPanZoom?: (event: any) => boolean;
  /** Width of the map (e.g. "100%" or "300px"). */
  width?: string;
  /** Height of the map (e.g. "100%" or "200px") */
  height?: string;
  /** Meridian location ID. */
  locationID: string;
  /** Meridian floor ID. */
  floorID: string;
  /** An {@link API} instance. Defaults to the one passed to {@link init}. */
  api?: API;
  /** Should we show the floor switcher UI control? Defaults to `true`. */
  showFloorsControl?: boolean;
  /** Should we show the Search UI control? Defaults to `true`. */
  showSearchControl?: boolean;
  /** Set to `false` to disable loading tags (default: `true`) */
  loadTags?: boolean;
  /** Options related to tags. */
  tags?: CreateMapTagsOptions;
  /** Set to `false` to disable loading placemarks (default: `true`) */
  loadPlacemarks?: boolean;
  /** Options related to placemarks. */
  placemarks?: CreateMapPlacemarksOptions;
  /** An array of custom overlays to draw on the map. */
  overlays?: CustomOverlay[];
  /** An array of custom annotations to draw on the map. */
  annotations?: CustomAnnotation[];
  /**
   * Minimum zoom level. Default value is dynamically calculated and matches
   * the initial map scale (further zooming out is not allowed
   */
  minZoomLevel?: number;
  /**
   * Maximum zoom level. Default value is 8 which equals eight times the
   * actual scale of the map.
   */
  maxZoomLevel?: number;
  /**
   * Called when the user clicks on the map. This is mostly useful as a way of
   * knowing that the user has potentially unfocused a tag or placemark. This is
   * NOT called when the user pans or zooms the map.
   */
  onMapClick?: () => void;
  /**
   * Called when a tag is clicked. Use `event.preventDefault()` to prevent the
   * default dialog from appearing.
   */
  // TODO: This should be Promise<void> since we're await'ing
  onTagClick?: (tag: TagData, event: MeridianEvent) => void;
  /**
   * Called when a placemark is clicked. Use `event.preventDefault()` to prevent
   * the default dialog from appearing.
   */
  onPlacemarkClick?: (placemark: PlacemarkData, event: MeridianEvent) => void;
  /**
   * Called when tags on the current floor are updated. `allTags` is every tag
   * on the current floor, even ones not shown on the map. `filteredTags` is
   * only the tags shown on the map (i.e. it respects `showControlTags` and
   * `filter`).
   */
  onTagsUpdate?: (tags: {
    allTags: TagData[];
    filteredTags: TagData[];
  }) => void;
  /**
   * Called when tags on the current floor are updated. `allPlacemarks` is every
   * placemark on the current floor, even ones not shown on the map.
   * `filteredPlacemarks` is only the tags shown on the map (i.e. it respects
   * `showHiddenPlacemarks` and `filter`).
   */
  onPlacemarksUpdate?: (placemarks: {
    allPlacemarks: PlacemarkData[];
    filteredPlacemarks: PlacemarkData[];
  }) => void;
  /**
   * Called with an array of floors after the floors list is updated.
   */
  onFloorsUpdate?: (floors: FloorData[]) => void;
  /**
   * Called with a floor object when the floor is changed.
   */
  onFloorChange?: (floor: FloorData) => void;
  /**
   * Called when the map has been destroyed, either by manually calling
   * map.destroy() or by being automatically destroyed when its DOM is tampered
   * with.
   */
  onDestroy?: () => void;
}

/**
 * MeridanSDK specific event object, used to `preventDefault` when overriding a
 * handler.
 */
export interface MeridianEvent {
  preventDefault: () => void;
}

/**
 * Returned from {@link createMap}, this object allows you to manipulate a map that
 * has already been created in the page.
 */
export interface MeridianMap {
  /**
   * Remove the Meridian Map from the DOM and clean up all ongoing network
   * connections.
   *
   * If you are writing a single page app you MUST use this call before hiding
   * the Meridian Map, or you will having network connections that keep going in
   * the background.
   */
  destroy: () => void;
  /** Has this map been destroyed */
  isDestroyed: boolean;
  /**
   * Update the Meridian map to have new options.
   */
  update: (updatedOptions: Partial<CreateMapOptions>) => void;
  /**
   * Zoom to the default zoom level and pan to the default position.
   */
  zoomToDefault: () => void;
  /**
   * Zoom to a given x, y coordinate and scale to a given zoom factor.
   */
  zoomToPoint: (options: { x: number; y: number; scale: number }) => void;
  /**
   * Center the map while retaining the current scale.
   */
  centerMap: () => void;
}

/**
 * Creates and returns a map object mounted at the given HTML element. If you
 * are using the tags.filter or onTagClick or onTagsUpdate functions, refer to
 * <https://tags.meridianapps.com/docs/track> for the schema.
 *
 * ```js
 * const api = new MeridianSDK.API({ token: "<TOKEN>" });
 * const map = MeridianSDK.createMap(
 *  document.querySelector("#map-container"),
 *  {
 *    api: api,
 *    locationID: "<location ID>",
 *    floorID: "<floor ID>",
 *    height: "500px"
 *  }
 * );
 * ```
 */
export function createMap(
  element: HTMLElement,
  options: CreateMapOptions
): MeridianMap {
  if (!element) {
    requiredParam("createMap", "node");
  }
  if (!options) {
    requiredParam("createMap", "options");
  }
  const destroy = () => {
    if (map.isDestroyed) {
      logError("can't call update on a destroyed MeridianMap");
      return;
    }
    map.isDestroyed = true;
    render(null, element);
    if (options.onDestroy) {
      options.onDestroy();
    }
  };
  let mapRef: MapComponent | null = null;
  const setMapRef = (newMapRef: MapComponent) => {
    mapRef = newMapRef;
  };
  const _update = (
    updatedOptions: Partial<CreateMapOptions>,
    { internalUpdate = true } = {}
  ) => {
    options = { ...options, ...updatedOptions };
    const api = context.api || options.api;
    if (!api) {
      requiredParam("createMap", "options.api");
      throw new Error("couldn't create MeridianMap");
    }
    domRef = render(
      <MapComponent
        api={api}
        {...options}
        update={_update}
        ref={setMapRef}
        destroy={destroy}
      />,
      element,
      domRef
    ) as any;
    sendAnalyticsCodeEvent({
      action: "map.update",
      locationID: options.locationID,
      onTagsUpdate: Boolean(options.onTagsUpdate),
      tagsFilter: Boolean(options.tags && options.tags.filter),
      placemarksFilter: Boolean(
        options.placemarks && options.placemarks.filter
      ),
      internalUpdate,
    });
  };
  const api = context.api || options.api;
  if (!api) {
    requiredParam("createMap", "options.api");
    throw new Error("couldn't create MeridianMap");
  }
  let domRef: HTMLElement = render(
    <MapComponent
      api={api}
      {...options}
      update={_update}
      ref={setMapRef}
      destroy={destroy}
    />,
    element
  ) as any;
  sendAnalyticsCodeEvent({
    action: "createMap",
    locationID: options.locationID,
    onTagsUpdate: Boolean(options.onTagsUpdate),
    tagsFilter: Boolean(options.tags && options.tags.filter),
    placemarksFilter: Boolean(options.placemarks && options.placemarks.filter),
  });
  const map: MeridianMap = {
    destroy,
    isDestroyed: false,
    update: (updatedOptions) => {
      if (map.isDestroyed) {
        logError("can't call update on a destroyed MeridianMap");
        return;
      }
      _update(updatedOptions, { internalUpdate: false });
    },
    zoomToDefault: () => {
      if (map.isDestroyed) {
        logError("can't call zoomToDefault on a destroyed MeridianMap");
        return;
      }
      mapRef?.zoomToDefault();
    },
    zoomToPoint: (options) => {
      if (map.isDestroyed) {
        logError("can't call update on a destroyed MeridianMap");
        return;
      }
      if (!options) {
        requiredParam("map.zoomToPoint", "options");
      }
      if (options.x === undefined) {
        requiredParam("map.zoomToPoint", "options.x");
      }
      if (options.y === undefined) {
        requiredParam("map.zoomToPoint", "options.y");
      }
      if (options.scale === undefined) {
        requiredParam("map.zoomToPoint", "options.scale");
      }
      mapRef?.zoomToPoint(options.x, options.y, options.scale);
    },
    centerMap: () => {
      if (map.isDestroyed) {
        logError("can't call update on a destroyed MeridianMap");
        return;
      }
      mapRef?.centerMap();
    },
  };
  return map;
}

/**
 * @deprecated
 * Deprecated function used to create an instance of {@link API}. Instead of
 * `createAPI(options)` you should now use `new API(options)`.
 */
export function createAPI(options: APIOptions): API {
  logDeprecated(
    "use `new MeridianSDK.API(options)` instead of `MeridianSDK.createAPI(options)`"
  );
  if (!options) {
    requiredParam("createAPI", "options");
  }
  return new API(options);
}

/**
 * Options passed to { @link API.openStream }.
 */
export interface OpenStreamOptions {
  /** Meridian location ID */
  locationID: string;
  /** Meridian floor ID */
  floorID?: string;
  /**
   * Default: [floorID] if resourceType === "FLOOR" OR [locationID] if resourceType === "LOCATION",
   * Valid values: [locationID | floorIDs | tagIDs | tagLabelIDs | zoneIDs]
   */
  resourceIDs?: string[];
  /**
   * Default: "FLOOR" if floorID is defined
   * Valid values: "LOCATION" | "TAG" | "FLOOR" | "LABEL" | "ZONE"
   */
  resourceType?: "LOCATION" | "TAG" | "FLOOR" | "LABEL" | "ZONE";
  /** Called with ALL tags on first load */
  onInitialTags?: (tags: TagData[]) => void;
  /** Called when a tag location updates */
  onTagUpdate?: (tag: TagData) => void;
  /** Called when an error happens */
  onException?: (error: Error) => void;
  /** Called when the stream closes */
  onClose?: () => void;
}

/**
 * Options passed to {@link API.getDirections}.
 */
export interface getDirectionsOptions {
  /** Meridian Location ID */
  locationID: string;
  /** Meridian start Floor ID */
  startFloorID: string;
  /** Meridian start Placemark ID */
  startPlacemarkID: string;
  /** Meridian end Placemark ID */
  endPlacemarkID: string;
  /** Transport Type ("accessible" or undefined). Default is undefined */
  transportType?: string;
}

/**
 * Holds an API token and environment. Can be used to access an `axios` instance
 * for REST API calls, or `openStream()` for opening a tag stream. You can
 * create multiple API instances in case you want to use multiple tokens (e.g.
 * to show data from multiple locations or organizations on a single page).
 *
 * @example
 * ```ts
 * // Basic usage
 * const api = new MeridianSDK.API({
 *   token: "<TOKEN GOES HERE>"
 * });
 *
 * // Multiple APIs at once
 * const apiOrg1 = new MeridianSDK.API({
 *   token: "Insert Org 1 token here"
 * });
 * MeridianSDK.createMap(elementOrg1, {
 *   api: apiOrg1,
 *   locationID: "Insert Org 1 location ID here",
 *   floorID: "Insert Org 1 floor ID here"
 * });
 *
 * const apiOrg2 = new MeridianSDK.API({
 *   token: "Insert Org 2 token here"
 * });
 * MeridianSDK.createMap(elementOrg2, {
 *   api: apiOrg2,
 *   locationID: "Insert Org 2 location ID here",
 *   floorID: "Insert Org 2 floor ID here"
 * });
 * ```
 */
export class API {
  /**
   * Meridian API token. Make sure to create a **READ ONLY** token for security.
   * Otherwise anyone using your page could take your token and modify all of
   * your Meridian data.
   */
  readonly token: string;

  /**
   * Language code that matches a supported language for this location.
   * Note: The LanguageCodes Type includes all possible language codes. See
   * "Translations" in Meridian Editor to learn exactly what languages are
   * supported for this location.
   */
  readonly language: LanguageCodes | undefined;

  /**
   * Meridian environment (`"production"` or `"eu"`). Defaults to
   * `"production"`.
   */
  readonly environment: EnvOptions;

  /** @internal */
  private readonly _axiosEditorAPI: AxiosInstance;

  /** @internal */
  private readonly _axiosTagsAPI: AxiosInstance;

  /** @internal */
  private readonly _axiosTagDetailAPI: AxiosInstance;

  /**
   * Pass the result to `init()` or `createMap()`.
   */
  constructor(options: APIOptions) {
    if (!options.token) {
      requiredParam("API", "token");
    }
    this.token = options.token;
    this.environment = checkDevEnvCase(options.environment) || "production";
    this.language = options.language;
    let acceptLanguage = {};
    if (this.language) {
      acceptLanguage = {
        "accept-language": this.language,
      };
    }
    this._axiosEditorAPI = axios.create({
      baseURL: envToEditorRestURL[this.environment],
      headers: {
        Authorization: `Token ${options.token}`,
        "Meridian-SDK": `WebSDK/${version}`,
        ...acceptLanguage,
      },
    });
    this._axiosTagsAPI = axios.create({
      baseURL: envToTagTrackerBaseRestURL[this.environment],
      headers: {
        Authorization: `Token ${options.token}`,
      },
    });
    this._axiosTagDetailAPI = axios.create({
      baseURL: envToTagTrackerDetailURL[this.environment],
      headers: {
        Authorization: `Token ${options.token}`,
      },
    });

    function checkDevEnvCase(env: any) {
      if (env === "devcloud") {
        return "devCloud";
      }
      return env;
    }
  }

  /**
   * @deprecated
   * Use the fetch methods instead
   */
  get axios(): AxiosInstance {
    logDeprecated("axios is deprecated; use the MeridianSDK.API fetch methods");
    return this._axiosEditorAPI;
  }

  /**
   * [async] Returns an Object with routes to the destination (endPlacemarkID)
   */
  async getDirections(
    options: getDirectionsOptions
  ): Promise<Record<string, any>> {
    if (!options.locationID) {
      requiredParam("getDirections", "locationID");
    }
    if (!options.startFloorID) {
      requiredParam("getDirections", "startFloorID");
    }
    if (!options.startPlacemarkID) {
      requiredParam("getDirections", "startPlacemarkID");
    }
    if (!options.endPlacemarkID) {
      requiredParam("getDirections", "endPlacemarkID");
    }
    const params = new URLSearchParams({
      from_map_id: options.startFloorID,
      from_placemark_id: options.startPlacemarkID,
      to_placemark_ids: options.endPlacemarkID,
      transport_type: options.transportType || "normal",
    });
    const url = `/locations/${options.locationID}/directions?${params}`;
    const response = await this._axiosEditorAPI.get(url);
    return response.data;
  }

  /**
   * [async] Returns an array of all tags on the specified location and floor
   */
  async fetchTagsByFloor(
    locationID: string,
    floorID: string
  ): Promise<TagData[]> {
    if (!locationID) {
      requiredParam("fetchTagsByFloor", "locationID");
    }
    if (!floorID) {
      requiredParam("fetchTagsByFloor", "floorID");
    }
    const response = await this._axiosTagsAPI.post("/assets", {
      floor_id: floorID,
      location_id: locationID,
    });
    return response.data.asset_updates;
  }

  /**
   * [async] Returns an array of all tags at the specified location
   */
  async fetchTagsByLocation(locationID: string): Promise<TagData[]> {
    if (!locationID) {
      requiredParam("fetchTagsByLocation", "locationID");
    }
    const response = await this._axiosTagsAPI.post("/assets", {
      location_id: locationID,
    });
    return response.data.asset_updates;
  }

  /**
   * [async] Returns dynamicly updated data for a specific tag.
   */
  async fetchTagDetail(mac: string): Promise<TagData> {
    if (!mac) {
      requiredParam("fetchTagDetail", "mac");
    }
    const response = await this._axiosTagDetailAPI.get(
      `/tagsinfo/detail/${mac}`
    );
    return response.data;
  }

  /**
   * [async] Returns an array of all placemarks at the specified location
   */
  async fetchPlacemarksByLocation(locationID: string): Promise<FloorData[]> {
    if (!locationID) {
      requiredParam("fetchPlacemarksByLocation", "locationID");
    }

    return await fetchAllPaginatedData(async (url) => {
      const { data } = await this._axiosEditorAPI.get(url);
      return data;
    }, `locations/${locationID}/placemarks`);
  }

  /**
   * [async] Returns an array of all placemarks on the specified location and
   * floor
   */
  async fetchPlacemarksByFloor(
    locationID: string,
    floorID: string
  ): Promise<FloorData[]> {
    if (!locationID) {
      requiredParam("fetchPlacemarksByFloor", "locationID");
    }
    if (!floorID) {
      requiredParam("fetchPlacemarksByFloor", "floorID");
    }
    return await fetchAllPaginatedData(async (url) => {
      const { data } = await this._axiosEditorAPI.get(url);
      return data;
    }, `locations/${locationID}/maps/${floorID}/placemarks`);
  }

  /**
   * [async] Returns an array of all floors at the specified location
   */
  async fetchFloorsByLocation(locationID: string): Promise<LocationData[]> {
    if (!locationID) {
      requiredParam("fetchFloorsByLocation", "locationID");
    }
    return await fetchAllPaginatedData(async (url) => {
      const { data } = await this._axiosEditorAPI.get(url);
      return data;
    }, `locations/${locationID}/maps`);
  }

  /**
   * [async] Returns the data of specified floor
   */
  async fetchFloorData(
    locationID: string,
    floorID: string
  ): Promise<FloorData> {
    if (!locationID) {
      requiredParam("fetchFloorData", "locationID");
    }
    if (!floorID) {
      requiredParam("fetchFloorData", "floorID");
    }
    const url = `locations/${locationID}/maps/${floorID}`;
    const { data } = await this._axiosEditorAPI.get(url);
    return data;
  }

  /**
   * [async] Returns an object URL for the given SVG URL
   *
   * This object URL can be used as the `src` for an `img` tag.
   *
   * This method fetches the SVG URL using your API token, since `img` tags
   * can't pass API tokens. The SVG URL can be obtained from the `svg_url`
   * property on a floor. When you're finished using this URL, you should call
   * `URL.revokeObjectURL` with the URL, so the browser can save memory by
   * releasing the data.
   */
  async fetchSVG(svgURL: string): Promise<string> {
    if (!svgURL) {
      requiredParam("fetchSVG", "svgURL");
    }
    const { data } = await this._axiosEditorAPI.get(svgURL, {
      responseType: "blob",
    });
    return URL.createObjectURL(data);
  }

  /**
   * Opens a tag stream for a given location and floor. `onInitialTags` is
   * called with the full list of tags for that floor.
   *
   * Note: When resourceType is set to "ZONE", `onTagUpdate` is called when
   * a tag/resource exits or enters the zone. Otherwise, `onTagUpdate` is
   * called every time a tag/resource is updated.
   *
   * @example
   * ```ts
   * const api = new MeridianSDK.API({
   *   token: token,
   *   environment: "production"
   * });
   *
   * const stream = api.openStream({
   *   locationID: locationID,
   *   floorID: floorID,
   *   onInitialTags: (tags) => {
   *     console.log("tags", tags);
   *   },
   *   onTagUpdate: (tag) => {
   *     console.log("update", tag);
   *   }
   * });
   *
   * // Tag Zones
   *
   * const stream = api.openStream({
   *   locationID: locationID,
   *   floorID: floorID,
   *   resourceIDs: ["1218"],
   *   resourceType: "ZONE",
   *   onInitialTags: (tags) => {
   *     console.log("tags", tags);
   *   },
   *   onTagUpdate: (tag) => {
   *     console.log("update", tag);
   *   }
   * });
   *
   * // call `stream.close()` when switching pages to avoid leaving the stream
   * // open and wasting bandwidth in the background
   * ```
   */
  openStream({
    locationID,
    floorID,
    resourceIDs,
    resourceType = "FLOOR",
    onInitialTags = () => {},
    onTagUpdate = () => {},
    onException = () => {},
    onClose = () => {},
  }: OpenStreamOptions): Stream {
    if (resourceType === "FLOOR" && floorID && !resourceIDs) {
      resourceIDs = [floorID];
    }
    if (resourceType === "LOCATION" && locationID && !resourceIDs) {
      resourceIDs = [locationID];
    }
    if (!locationID) {
      requiredParam("openStream", "locationID");
    }
    if (resourceType === "FLOOR" && !floorID) {
      requiredParam("openStream", "floorID");
    }
    if (!resourceIDs) {
      requiredParam("openStream", "resourceIDs");
    }

    let isClosed = false;
    const params = new URLSearchParams({
      method: "POST",
      authorization: `Token ${this.token}`,
    });
    const url = envToTagTrackerStreamingURL[this.environment];
    const ws = new ReconnectingWebSocket(`${url}?${params}`);
    const request = {
      asset_requests: [
        {
          resource_type: resourceType,
          location_id: locationID,
          resource_ids: resourceIDs,
        },
      ],
    };
    const close = () => {
      if (isClosed) {
        return;
      }
      isClosed = true;
      asyncClientCall(onClose);
      ws.close();
    };
    const loadInitialTags = async () => {
      if (floorID && resourceType === "FLOOR") {
        try {
          const tags = await this.fetchTagsByFloor(locationID, floorID);
          asyncClientCall(onInitialTags, tags);
        } catch (err: any) {
          asyncClientCall(onException, err);
          close();
        }
      } else if (locationID && resourceType === "LOCATION") {
        try {
          const tags = await this.fetchTagsByLocation(locationID);
          asyncClientCall(onInitialTags, tags);
        } catch (err: any) {
          asyncClientCall(onException, err);
          close();
        }
      }
    };
    ws.addEventListener("open", () => {
      if (isClosed) {
        return;
      }
      ws.send(JSON.stringify(request));
    });
    ws.addEventListener("message", (event) => {
      if (isClosed) {
        return;
      }
      const data = JSON.parse(event.data);
      if (data.error) {
        onException(new Error(data.error.message));
        return;
      }
      if (data.result) {
        for (const assetUpdate of data.result.asset_updates) {
          const eventType = assetUpdate.event_type;
          if (eventType === "UPDATE") {
            asyncClientCall(onTagUpdate, assetUpdate);
          } else {
            throw new Error(`Unknown event type: ${eventType}`);
          }
        }
        return;
      }
      throw new Error(`Unknown message: ${event.data}`);
    });
    ws.addEventListener("error", () => {
      if (isClosed) {
        return;
      }
      onException(new Error("MeridianSDK.openStream connection error"));
    });
    ws.addEventListener("close", () => {
      if (isClosed) {
        return;
      }
      onClose();
    });
    loadInitialTags();
    return { close };
  }
}

/** @internal */
async function fetchAllPaginatedData<T>(
  get: (url: string) => Promise<{ next: string; results: T[] }>,
  url: string
): Promise<T[]> {
  const data = await get(url);
  const results = data.results;
  let next = data.next;
  while (next) {
    const data = await get(next);
    results.push(...data.results);
    next = data.next;
  }
  return results;
}

/** @internal */
const envToTagTrackerBaseRestURL = {
  development: "http://localhost:8091/api/v1",
  devCloud: "https://dev-tags.meridianapps.com/api/v1",
  production: "https://tags.meridianapps.com/api/v1",
  eu: "https://tags-eu.meridianapps.com/api/v1",
  staging: "https://staging-tags.meridianapps.com/api/v1",
} as const;

/** @internal */
const envToTagTrackerDetailURL = {
  development: "http://localhost:8091/api",
  devCloud: "https://dev-tags.meridianapps.com/api",
  production: "https://tags.meridianapps.com/api",
  eu: "https://tags-eu.meridianapps.com/api",
  staging: "https://staging-tags.meridianapps.com/api",
} as const;

/** @internal */
const envToTagTrackerStreamingURL = {
  development: "ws://localhost:8091/streams/v1/assets",
  devCloud: "wss://dev-tags.meridianapps.com/streams/v1/assets",
  production: "wss://tags.meridianapps.com/streams/v1/assets",
  eu: "wss://tags-eu.meridianapps.com/streams/v1/assets",
  staging: "wss://staging-tags.meridianapps.com/streams/v1/assets",
} as const;

/** @internal */
const envToEditorRestURL = {
  development: "http://localhost:8091/api",
  devCloud: "https://dev-edit.meridianapps.com/api",
  production: "https://edit.meridianapps.com/api",
  eu: "https://edit-eu.meridianapps.com/api",
  staging: "https://staging-edit.meridianapps.com/api",
} as const;

/**
 * Environment name used in {@link APIOptions}. If unsure, use `"production"`.
 */
export type EnvOptions =
  | "production"
  | "staging"
  | "eu"
  | "development"
  | "devCloud";

/**
 * Options passed to {@link createAPI}.
 *
 * ```js
 * const api = new MeridianSDK.API({
 *   environment: "production", // or "eu"
 *   token: "<token>",
 *   language: "<languageCode>" // optional, defaults to "en"
 * });
 * ```
 */
export interface APIOptions {
  environment?: EnvOptions;
  token: string;
  language?: LanguageCodes;
}

/**
 * An open tag stream that can be closed. Returned by {@link API.openStream}.
 *
 * ```js
 * const api = new MeridianSDK.API({
 *   // ...
 * });
 *
 * const stream = api.openStream({
 *   // ...
 * });
 *
 * stream.close();
 * ```
 */
export interface Stream {
  close: () => void;
}

/** Meridian Tag data */
export interface TagData {
  [key: string]: any;
  /** Tag MAC address (uppercase, no punctuation) */
  mac: string;
}

/** Meridian Placemark data */
export interface PlacemarkData {
  [key: string]: any;
  /** Placemark ID */
  id: string;
}

/** Meridian Floor data */
export interface FloorData {
  [key: string]: any;
  /** Floor ID */
  id: string;
}

/** Meridian Location data */
export interface LocationData {
  [key: string]: any;
  /** Location ID */
  id: string;
}
