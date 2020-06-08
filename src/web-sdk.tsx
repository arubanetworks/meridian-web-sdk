/** @jsx h */

/*!
 * @license
 * Copyright 2020 Hewlett Packard Enterprise Development LP
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
 * See [[init]] and [[createMap]] for getting started.
 *
 * ```js
 * const api = new MeridianSDK.API({ token: "<TOKEN>" });
 * MeridianSDK.init({ api: api });
 * const map = MeridianSDK.createMap(
 *  document.querySelector("#map-container"),
 *  {
 *    locationID: "<location ID>",
 *    floorID: "<floor ID>",
 *    height: "500px"
 *  }
 * )
 * ```
 * @packageDocumentation
 */

import { h, render } from "preact";
import axios, { AxiosInstance } from "axios";
import ReconnectingWebSocket from "reconnecting-websocket";

import Map from "./Map";
import {
  requiredParam,
  asyncClientCall,
  envToEditorRestURL,
  fetchTagsByFloor,
  envToTagTrackerStreamingURL,
  deprecated
} from "./util";
import { sendAnalyticsCodeEvent } from "./analytics";

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
type APIContext = {
  api?: API;
};

/** @internal */
const context: APIContext = {
  api: undefined
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
 * Pass this to `shouldMapPanZoom` in [[createMap]] if you would like the user
 * to use two fingers or hold down a modifier key in order to zoom the map.
 *
 * ```js
 * const api = new MeridianSDK.API({ token: "<TOKEN>" });
 *
 * MeridianSDK.init({ api: api });
 *
 * const map = MeridianSDK.createMap(
 *  document.querySelector("#map-container"),
 *  {
 *    locationID: "<location ID>",
 *    floorID: "<floor ID>",
 *    height: "500px",
 *    shouldMapPanZoom: MeridianSDK.restrictedPanZoom,
 *  }
 * )
 * ```
 */
export function restrictedPanZoom(
  event: TouchEvent | WheelEvent | MouseEvent
): boolean {
  if (event instanceof WheelEvent) {
    return event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
  } else if (event instanceof TouchEvent) {
    return event.touches.length >= 2;
  }
  return true;
}

/**
 * Initializes a share MeridianSDK API instance for use across all calls to
 * [[createMap]]. You can either call this function or pass your [[API]]
 * instance directly to [[createMap]].
 *
 * ```js
 * const api = new MeridianSDK.API({
 *   token: "<TOKEN GOES HERE>"
 * });
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

export type CreateMapTagsOptions = {
  /** Should we show control tags? Defaults to false. */
  showControlTags?: boolean;
  /**
   * Filter function used to hide tags. Return false to hide a tag. Defaults
   * to `() => true`.
   */
  filter?: (tag: Record<string, any>) => boolean;
  /** Disable clicking tags when true. Defaults to false. */
  disabled?: boolean;
};

export type CreateMapPlacemarksOptions = {
  /** Should we show hidden placemarks? Defaults to false. */
  showHiddenPlacemarks?: boolean;
  /**
   * Filter function used to hide placemarks. Return false to hide a
   * placemark. Defaults to `() => true`.
   */
  filter?: (placemark: Record<string, any>) => boolean;
  /** Disable clicking placemarks when true. Defaults to false. */
  disabled?: boolean;
};

/**
 * Options passed to [[createMap]].
 */
export type CreateMapOptions = {
  /** See [[restrictedPanZoom]]. */
  shouldMapPanZoom?: (event: TouchEvent | WheelEvent | MouseEvent) => boolean;
  /** Width of the map (e.g. "100%" or "300px"). */
  width?: string;
  /** Height of the map (e.g. "100%" or "200px") */
  height?: string;
  /** Meridian location ID. */
  locationID: string;
  /** Meridian floor ID. */
  floorID: string;
  /** An [[API]] instance. Defaults to the one passed to [[init]]. */
  api?: API;
  /** Should we show the floor switcher UI control? Defaults to true. */
  showFloorsControl?: boolean;
  /** Should we show the tag switcher UI control? Defaults to true. */
  showTagsControl?: boolean;
  /** Options related to tags. */
  tags?: CreateMapTagsOptions;
  /** Options related to placemarks. */
  placemarks?: CreateMapPlacemarksOptions;
  /**
   * Called when a tag is clicked. Use `event.preventDefault()` to prevent the
   * default dialog from appearing.
   */
  onTagClick?: (tag: Record<string, any>, event: MeridianEvent) => void;
  /**
   * Called when a placemark is clicked. Use `event.preventDefault()` to prevent
   * the default dialog from appearing.
   */
  onPlacemarkClick?: (
    placemark: Record<string, any>,
    event: MeridianEvent
  ) => void;
  /**
   * Called when tags on the current floor are updated. `allTags` is every tag
   * on the current floor, even ones not shown on the map. `filteredTags` is
   * only the tags shown on the map (i.e. it respects `showControlTags` and
   * `filter`).
   */
  onTagsUpdate?: (tags: {
    allTags: Record<string, any>[];
    filteredTags: Record<string, any>[];
  }) => void;
  /**
   * Called with an array of floors after the floors list is updated.
   */
  onFloorsUpdate?: (floors: Record<string, any>[]) => void;
};

/**
 * MeridanSDK specific event object, used to `preventDefault` when overriding a
 * handler.
 */
export type MeridianEvent = {
  preventDefault: () => void;
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

/**
 * Returned from [[createMap]], this object allows you to manipulate a map that
 * has already been created in the page.
 */
export type MeridianMap = {
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
 *
 * ```js
 * const api = new MeridianSDK.API({ token: "<TOKEN>" });
 * MeridianSDK.init({ api: api });
 * const map = MeridianSDK.createMap(
 *  document.querySelector("#map-container"),
 *  {
 *    locationID: "<location ID>",
 *    floorID: "<floor ID>"
 *  }
 * )
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
 * Deprecated function used to create an instance of [[API]]. Instead of
 * `createAPI(options)` you should now use `new API(options)`.
 * @deprecated
 */
export function createAPI(options: APIOptions): API {
  deprecated(
    "use `new MeridianSDK.API(options)` instead of `MeridianSDK.createAPI(options)`"
  );
  if (!options) {
    requiredParam("createAPI", "options");
  }
  return new API(options);
}

/**
 * Holds an API token and environment. Can be used to access an `axios` instance
 * for REST API calls, or `openStream()` for opening a tag stream. You can
 * create multiple API instances in case you want to use multiple tokens (e.g.
 * to show data from multiple locations or organizations on a single page).
 *
 * ```js
 * const api = new MeridianSDK.API({
 *   token: "<TOKEN GOES HERE>"
 * });
 *
 * MeridianSDK.init({ api: api });
 * ```
 *
 * You can use multiple API instances if you want to use multiple
 * tokens/environments on a single page:
 *
 * ```js
 * const apiOrg1 = new MeridianSDK.API({
 *   token: "Insert Org 1 token here"
 * });
 *
 * const apiOrg2 = new MeridianSDK.API({
 *   token: "Insert Org 2 token here"
 * });
 *
 * MeridianSDK.createMap(elementOrg1, {
 *   api: apiCustomer1,
 *   locationID: "Insert Org 1 location ID here",
 *   floorID: "Insert Org 1 floor ID here"
 * });
 *
 * MeridianSDK.createMap(elementOrg2, {
 *   api: apiCustomer2,
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
  token: string;

  /**
   * Meridian environment (`"production"` or `"eu"`). Defaults to
   * `"production"`.
   */
  environment: EnvOptions;

  /**
   * Axios REST API client with authentication credentials already added. See
   * the [Axios documentation](https://github.com/axios/axios) and [Meridian API
   * documentation](https://docs.meridianapps.com/hc/en-us/categories/360002761313-Developers).
   *
   * ```js
   * const api = new MeridianSDK.API({ token: "<TOKEN>" });
   * const result = await api.axios.get(`locations/${locationID}`);
   * console.log(result.data);
   */
  axios: AxiosInstance;

  /**
   * Pass the result to `init()` or `createMap()`.
   * @internal
   */
  constructor(options: APIOptions) {
    if (!options.token) {
      requiredParam("API", "token");
    }
    this.token = options.token;
    this.environment = options.environment || "production";
    this.axios = axios.create({
      baseURL: envToEditorRestURL[this.environment],
      headers: {
        Authorization: `Token ${options.token}`
      }
    });
  }

  /**
   * Opens a tag stream for a given location and floor. `onInitialTags` is called with the full list of tags for that
   * floor, then `onTagUpdate` is called every time a tag moves on the floor.
   *
   * ```js
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
   * // call `stream.close()` when switching pages to avoid leaving the stream
   * // open and wasting bandwidth in the background
   * ```
   */
  openStream(options: {
    /** Meridian location ID */
    locationID: string;
    /** Meridian floor ID */
    floorID: string;
    /** Called with ALL tags on first load */
    onInitialTags?: (tags: Record<string, any>[]) => void;
    /** Called when a tag exits the floor */
    onTagLeave?: (tag: Record<string, any>) => void;
    /** Called when a tag location updates */
    onTagUpdate?: (tag: Record<string, any>) => void;
    /** Called when an error happens */
    onException?: (error: Error) => void;
    /** Called when the stream closes */
    onClose?: () => void;
  }): Stream {
    if (!options.locationID) {
      requiredParam("openStream", "locationID");
    }
    if (!options.floorID) {
      requiredParam("openStream", "floorID");
    }
    const params = new URLSearchParams();
    params.set("method", "POST");
    params.set("authorization", `Token ${this.token}`);
    const url = envToTagTrackerStreamingURL[this.environment];
    const ws = new ReconnectingWebSocket(`${url}?${params}`);
    const request = {
      asset_requests: [
        {
          resource_type: "FLOOR",
          location_id: options.locationID,
          resource_ids: [options.floorID]
        }
      ]
    };
    fetchTagsByFloor({
      api: this,
      locationID: options.locationID,
      floorID: options.floorID
    }).then(tags => {
      options.onInitialTags?.(tags);
    });
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify(request));
    });
    ws.addEventListener("message", event => {
      const data = JSON.parse(event.data);
      if (data.error) {
        options.onException?.(new Error(data.error.message));
        return;
      }
      if (data.result) {
        for (const assetUpdate of data.result.asset_updates) {
          const eventType = assetUpdate.event_type;
          if (eventType === "DELETE") {
            if (options.onTagLeave) {
              asyncClientCall(options.onTagLeave, assetUpdate);
            }
          } else if (eventType === "UPDATE") {
            if (options.onTagUpdate) {
              asyncClientCall(options.onTagUpdate, assetUpdate);
            }
          } else {
            throw new Error(`Unknown event type: ${eventType}`);
          }
        }
        return;
      }
      throw new Error(`Unknown message: ${event.data}`);
    });
    ws.addEventListener("error", () => {
      options.onException?.(
        new Error("MeridianSDK.openStream connection error")
      );
    });
    ws.addEventListener("close", () => {
      options.onClose?.();
    });
    return {
      close: () => ws.close()
    };
  }
}

/**
 * Environment name used in [[APIOptions]]. If unsure, use `"production"`.
 */
export type EnvOptions = "production" | "staging" | "eu" | "development";

/**
 * Options passed to [[createAPI]].
 *
 * ```js
 * const api = new MeridianSDK.API({
 *   environment: "production", // or "eu"
 *   token: "<token>"
 * });
 * ```
 */
export type APIOptions = { environment?: EnvOptions; token: string };

/**
 * An open tag stream that can be closed. Returned by [[API.openStream]].
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
export type Stream = {
  close: () => void;
};
