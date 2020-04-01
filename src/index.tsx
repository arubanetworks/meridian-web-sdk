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

import { h, render } from "preact";
import { AxiosInstance } from "axios";

import Map from "./Map";
import API, { APIOptions } from "./API";
import { requiredParam } from "./util";
import { sendAnalyticsCodeEvent } from "./analytics";

// Wait to load Preact's debug module until the page is loaded since it assumes
// document.body exists, which is not true if someone loads our script in the
// <head> of a document
const loadPreactDebug = () => require("preact/debug");
if (document.readyState === "complete") {
  setTimeout(loadPreactDebug, 0);
} else {
  document.addEventListener("DOMContentLoaded", loadPreactDebug, false);
}

type APIContext = {
  api?: AxiosInstance;
};

const context: APIContext = {
  api: undefined
};

// This is kinda irritating, but importing package.json just to get the version
// is a waste of kilobytes, so we're using webpack's DefinePlugin to do a macro
/* global GLOBAL_VERSION */

/**
 * The current version of the Meridian Web SDK. Useful for checking which
 * version is running.
 */
export const version = GLOBAL_VERSION;

/**
 * This function can be used to restrict pan/zoom events unless the user is
 * holding down a modifier key (Control, Alt, Command, Shift) on their keyboard.
 * This prevents accidental map interactions in pages with lots of scrolling
 * content.
 */
export function restrictedPanZoom(event: TouchEvent | WheelEvent | MouseEvent) {
  if (event instanceof WheelEvent) {
    return event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
  } else if (event instanceof TouchEvent) {
    return event.touches.length >= 2;
  }
  return true;
}

/**
 * Initializes a share MeridianSDK API instance for use across all calls to
 * createMap. You can either call this function or pass your API instance
 * directly to createMap.
 */
export function init(options: { api: AxiosInstance }) {
  if (!options) {
    requiredParam("init", "options");
  }
  if (!options.api) {
    requiredParam("init", "options.api");
  }
  context.api = options.api;
}

type CreateMapOptions = {
  shouldMapPanZoom?: (event: TouchEvent | WheelEvent | MouseEvent) => boolean;
  width?: string;
  height?: string;
  locationID: string;
  floorID: string;
  api?: AxiosInstance;
  showFloorsControl?: boolean;
  showTagsControl?: boolean;
  tags?: {
    showControlTags?: boolean;
    filter?: (tag: Record<string, any>) => boolean;
    disabled?: boolean;
  };
  placemarks?: {
    showHiddenPlacemarks?: boolean;
    filter?: (placemark: Record<string, any>) => boolean;
    disabled?: boolean;
  };
  onTagClick?: (tag: Record<string, any>) => void;
  onPlacemarkClick?: (placemark: Record<string, any>) => void;
  onTagsUpdate?: (tags: {
    allTags: Record<string, any>[];
    filteredTags: Record<string, any>[];
  }) => void;
  onFloorsUpdate?: (floors: Record<string, any>[]) => void;
};

// TODO: Move this type to Map.js after we convert it to TS.

// type MapProps = CreateMapOptions & {
//   youAreHerePlacemarkID?: string;
//   // TODO: Internal only, remove
//   update: (newProps: MapProps) => void;
//   // TODO: `onMarkerClick` is internal only, we should remove from public types
//   onMarkerClick?: (marker: Record<string, any>) => void;
//   // TODO: `onMapClick` is not used or documented, we should delete it
//   onMapClick?: (event: MouseEvent) => void;
//   api: AxiosInstance;
// };

type MeridianMap = {
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
};

/**
 * Creates and returns a map object mounted at the given HTML element. If you
 * are using the tags.filter or onTagClick or onTagsUpdate functions, refer to
 * <https://tags.meridianapps.com/docs/track> for the schema.
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
  let mapRef: Map | null = null;
  const setMapRef = (newMapRef: Map) => {
    mapRef = newMapRef;
  };
  const _update = (
    updatedOptions: Partial<CreateMapOptions>,
    { internalUpdate = true } = {}
  ) => {
    options = { ...options, ...updatedOptions };
    domRef = render(
      <Map api={context.api} update={_update} {...options} ref={setMapRef} />,
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
      internalUpdate
    });
  };
  let domRef: HTMLElement = render(
    <Map api={context.api} update={_update} {...options} ref={setMapRef} />,
    element
  ) as any;
  sendAnalyticsCodeEvent({
    action: "createMap",
    locationID: options.locationID,
    onTagsUpdate: Boolean(options.onTagsUpdate),
    tagsFilter: Boolean(options.tags && options.tags.filter),
    placemarksFilter: Boolean(options.placemarks && options.placemarks.filter)
  });
  return {
    update: updatedOptions => {
      _update(updatedOptions, { internalUpdate: false });
    },
    zoomToDefault: () => {
      mapRef?.zoomToDefault();
    },
    zoomToPoint: options => {
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
    }
  };
}

/**
 * Creates and returns an API instance. Each API instance takes an environment
 * and a token. You can create multiple API instances in case you want to use
 * multiple tokens (e.g. to show data from multiple locations or organizations
 * on a single page).
 *
 * Pass this either to init() or createMap().
 */
export function createAPI(options: APIOptions) {
  if (!options) {
    requiredParam("createAPI", "options");
  }
  return new API(options);
}
