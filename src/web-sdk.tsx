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
import { sendAnalyticsCodeEvent } from "./analytics";
import MapComponent from "./Map";
import { asyncClientCall, deprecated, requiredParam } from "./util";
import placemarkIconGeneric from "../files/placemarks/generic.svg";

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
 * function onPlacemarkClick(placemark) {
 *   const url = MeridianSDK.placemarkIconURL(placemark.type);
 *   console.log(url);
 * }
 */
export function placemarkIconURL(type: string): string {
  const url = placemarkIcons.get(type);
  if (!url) {
    // eslint-disable-next-line no-console
    console.error(`placemarkIconURL: no such icon '${type}'`);
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
 * Object describing a polygon overlay drawn on the map
 */
export type CustomOverlayPolygon = {
  type: "polygon";
  points: number[];
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLineJoin?: "miter" | "round";
};

/**
 * Object describing a polyline overlay drawn on the map
 */
export type CustomOverlayPolyline = {
  type: "polyline";
  points: number[];
  stroke?: string;
  strokeWidth?: number;
  strokeLineJoin?: "miter" | "round";
  strokeLineCap?: "butt" | "round" | "square";
};

/**
 * Object describing a custom overlay
 */
export type CustomOverlay = CustomOverlayPolygon | CustomOverlayPolyline;

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
  /** Set to false to disable loading placemarks (default: true) */
  loadPlacemarks?: boolean;
  /** Options related to placemarks. */
  placemarks?: CreateMapPlacemarksOptions;
  /** An array of custom overlays to draw on the map. */
  overlays?: CustomOverlay[];
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
   * Called when tags on the current floor are updated. `allPlacemarks` is every
   * placemark on the current floor, even ones not shown on the map.
   * `filteredPlacemarks` is only the tags shown on the map (i.e. it respects
   * `showHiddenPlacemarks` and `filter`).
   */
  onPlacemarksUpdate?: (placemarks: {
    allPlacemarks: Record<string, any>[];
    filteredPlacemarks: Record<string, any>[];
  }) => void;
  /**
   * Called with an array of floors after the floors list is updated.
   */
  onFloorsUpdate?: (floors: Record<string, any>[]) => void;
  /**
   * Called with a floor object when the floor is changed.
   */
  onFloorChange?: (floor: Record<string, any>) => void;
  /**
   * Called when the map has been destroyed, either by manually calling
   * [[destroy]] or by being automatically destroyed when its DOM is tampered
   * with.
   */
  onDestroy?: () => void;
};

/**
 * MeridanSDK specific event object, used to `preventDefault` when overriding a
 * handler.
 */
export type MeridianEvent = {
  preventDefault: () => void;
};

/**
 * Returned from [[createMap]], this object allows you to manipulate a map that
 * has already been created in the page.
 */
export type MeridianMap = {
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
};

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
 *
 * Call this before navigating to a new page, to close network connections. This
 * is critical for usage within a single page application, or even just an
 * interactive page with JS that unmounts the map container element (e.g.
 * removing it from the DOM or setting the `innerHTML`).
 *
 * ```js
 * map.destroy();
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
      // eslint-disable-next-line no-console
      console.error("can't call update on a destroyed MeridianMap");
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
    domRef = render(
      <MapComponent
        api={context.api}
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
      internalUpdate
    });
  };
  let domRef: HTMLElement = render(
    <MapComponent
      api={context.api}
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
    placemarksFilter: Boolean(options.placemarks && options.placemarks.filter)
  });
  const map: MeridianMap = {
    destroy,
    isDestroyed: false,
    update: updatedOptions => {
      if (map.isDestroyed) {
        // eslint-disable-next-line no-console
        console.error("can't call update on a destroyed MeridianMap");
        return;
      }
      _update(updatedOptions, { internalUpdate: false });
    },
    zoomToDefault: () => {
      if (map.isDestroyed) {
        // eslint-disable-next-line no-console
        console.error("can't call zoomToDefault on a destroyed MeridianMap");
        return;
      }
      mapRef?.zoomToDefault();
    },
    zoomToPoint: options => {
      if (map.isDestroyed) {
        // eslint-disable-next-line no-console
        console.error("can't call update on a destroyed MeridianMap");
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
    }
  };
  return map;
}

/**
 * @deprecated
 * Deprecated function used to create an instance of [[API]]. Instead of
 * `createAPI(options)` you should now use `new API(options)`.
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
 * @example
 * // Basic usage
 * const api = new MeridianSDK.API({
 *   token: "<TOKEN GOES HERE>"
 * });
 * MeridianSDK.init({ api: api });
 *
 * // Multiple APIs at once
 * const apiOrg1 = new MeridianSDK.API({
 *   token: "Insert Org 1 token here"
 * });
 * const apiOrg2 = new MeridianSDK.API({
 *   token: "Insert Org 2 token here"
 * });
 * MeridianSDK.createMap(elementOrg1, {
 *   api: apiCustomer1,
 *   locationID: "Insert Org 1 location ID here",
 *   floorID: "Insert Org 1 floor ID here"
 * });
 * MeridianSDK.createMap(elementOrg2, {
 *   api: apiCustomer2,
 *   locationID: "Insert Org 2 location ID here",
 *   floorID: "Insert Org 2 floor ID here"
 * });
 */
export class API {
  /**
   * Meridian API token. Make sure to create a **READ ONLY** token for security.
   * Otherwise anyone using your page could take your token and modify all of
   * your Meridian data.
   */
  readonly token: string;

  /**
   * Meridian environment (`"production"` or `"eu"`). Defaults to
   * `"production"`.
   */
  readonly environment: EnvOptions;

  /** @internal */
  private readonly _axiosEditorAPI: AxiosInstance;

  /** @internal */
  private readonly _axiosTagsAPI: AxiosInstance;

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
    this._axiosEditorAPI = axios.create({
      baseURL: envToEditorRestURL[this.environment],
      headers: {
        Authorization: `Token ${options.token}`,
        "Meridian-SDK": `WebSDK/${version}`
      }
    });
    this._axiosTagsAPI = axios.create({
      baseURL: envToTagTrackerBaseRestURL[this.environment],
      headers: {
        Authorization: `Token ${options.token}`
      }
    });
  }

  /**
   * @deprecated
   * Use the fetch methods instead
   */
  get axios(): AxiosInstance {
    deprecated("axios is deprecated; use the MeridianSDK.API fetch methods");
    return this._axiosEditorAPI;
  }

  /**
   * [async] Returns an array of all tags on the specified location and floor
   */
  async fetchTagsByFloor(
    locationID: string,
    floorID: string
  ): Promise<Record<string, any>[]> {
    if (!locationID) {
      requiredParam("fetchTagsByFloor", "locationID");
    }
    if (!floorID) {
      requiredParam("fetchTagsByFloor", "floorID");
    }
    const response = await this._axiosTagsAPI.post("track/assets", {
      floor_id: floorID,
      location_id: locationID
    });
    return response.data.asset_updates;
  }

  /**
   * [async] Returns an array of all tags at the specified location
   */
  async fetchTagsByLocation(
    locationID: string
  ): Promise<Record<string, any>[]> {
    if (!locationID) {
      requiredParam("fetchTagsByLocation", "locationID");
    }
    const response = await this._axiosTagsAPI.post("/track/assets", {
      location_id: locationID
    });
    return response.data.asset_updates;
  }

  /**
   * [async] Returns an array of all placemarks on the specified location and
   * floor
   */
  async fetchPlacemarksByFloor(
    locationID: string,
    floorID: string
  ): Promise<Record<string, any>[]> {
    if (!locationID) {
      requiredParam("fetchPlacemarksByFloor", "locationID");
    }
    if (!floorID) {
      requiredParam("fetchPlacemarksByFloor", "floorID");
    }
    return await fetchAllPaginatedData(async url => {
      const { data } = await this._axiosEditorAPI.get(url);
      return data;
    }, `locations/${locationID}/maps/${floorID}/placemarks`);
  }

  /**
   * [async] Returns an array of all floors at the specified location
   */
  async fetchFloorsByLocation(
    locationID: string
  ): Promise<Record<string, any>[]> {
    if (!locationID) {
      requiredParam("fetchFloorsByLocation", "locationID");
    }
    return await fetchAllPaginatedData(async url => {
      const { data } = await this._axiosEditorAPI.get(url);
      return data;
    }, `locations/${locationID}/maps`);
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
      responseType: "blob"
    });
    return URL.createObjectURL(data);
  }

  /**
   * Opens a tag stream for a given location and floor. `onInitialTags` is
   * called with the full list of tags for that floor, then `onTagUpdate` is
   * called every time a tag moves on the floor.
   *
   * @example
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
    this.fetchTagsByFloor(options.locationID, options.floorID).then(tags => {
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
  staging: "https://staging-tags.meridianapps.com/api/v1"
} as const;

/** @internal */
const envToTagTrackerStreamingURL = {
  development: "ws://localhost:8091/streams/v1/track/assets",
  devCloud: "wss://dev-tags.meridianapps.com/streams/v1/track/assets",
  production: "wss://tags.meridianapps.com/streams/v1/track/assets",
  eu: "wss://tags-eu.meridianapps.com/streams/v1/track/assets",
  staging: "wss://staging-tags.meridianapps.com/streams/v1/track/assets"
} as const;

/** @internal */
const envToEditorRestURL = {
  development: "http://localhost:8091/api",
  devCloud: "https://dev-edit.meridianapps.com/api",
  production: "https://edit.meridianapps.com/api",
  eu: "https://edit-eu.meridianapps.com/api",
  staging: "https://staging-edit.meridianapps.com/api"
} as const;

/**
 * Environment name used in [[APIOptions]]. If unsure, use `"production"`.
 */
export type EnvOptions =
  | "production"
  | "staging"
  | "eu"
  | "development"
  | "devCloud";

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
