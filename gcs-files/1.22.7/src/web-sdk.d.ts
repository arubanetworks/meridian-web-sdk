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
import { AxiosInstance } from "axios";
import { h } from "preact";
import { LanguageCodes } from "./Translations";
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
export declare function placemarkIconURL(type: string): string;
/**
 * Returns an array of points (numbers) based on a placemarks's area property
 */
export declare function pointsFromArea(area: string | null | undefined): number[];
/**
 * The current version of the Meridian Web SDK. Useful for checking which
 * version is running.
 *
 * ```js
 * console.log(MeridianSDK.version);
 * ```
 */
export declare const version: string;
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
export declare function restrictedPanZoom(event: any): boolean;
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
export declare function latLngToMapPoint(floorData: Partial<FloorData>, { lat, lng }: {
    lat: number;
    lng: number;
}): {
    x: number;
    y: number;
};
/**
 * Convert from a point on a referenced map to latitude and longitude. Uses mercator projection.
 *
 * The basic formula to achieve this is as follows:
 *
 * latitute = 2(tan^-1)[exp(y / radius)]
 * longitude = central parallel of map + (x / radius) - PI / 2
 *
 */
export declare function mapPointToLatLng(floorData: Partial<FloorData>, { x, y }: {
    x: number;
    y: number;
}): {
    lat: number;
    lng: number;
};
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
export declare function init(options: {
    api: API;
}): void;
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
export type CustomOverlay = CustomOverlayImage | CustomOverlayPath | CustomOverlayPolygon | CustomOverlayPolyline | CustomOverlayCircle | CustomOverlayMarker | CustomOverlayUse;
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
    /**
     * Sort the floors in the Floor Switcher UI descending in order.
     * Defaults to `false` (ascending in order).
     */
    floorsControlSortDescending?: boolean;
    /**
     * Set to `false` to disable loading tags. Defaults to `true`.
     * This is required for locations without a TAGS SKU license
     */
    loadTags?: boolean;
    /** Options related to tags. */
    tags?: CreateMapTagsOptions;
    /** Set to `false` to disable loading placemarks. Defaults to `true`. */
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
    /** Called after the floors list is updated. */
    onFloorsUpdate?: (floors: FloorData[]) => void;
    /** Called after the floor is changed. */
    onFloorChange?: (floor: FloorData) => void;
    /** Called when the loading state changes. */
    onLoadingStateChange?: (isLoading: boolean) => void;
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
     * Set zoom to the default level and pan to the default position.
     */
    zoomToDefault: () => void;
    /**
     * Pan to x/y coordinate and scale to a given zoom factor.
     */
    zoomToPoint: (options: {
        x: number;
        y: number;
        scale: number;
    }) => void;
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
export declare function createMap(element: HTMLElement, options: CreateMapOptions): MeridianMap;
/**
 * @deprecated
 * Deprecated function used to create an instance of {@link API}. Instead of
 * `createAPI(options)` you should now use `new API(options)`.
 */
export declare function createAPI(options: APIOptions): API;
/**
 * Options passed to {@link API.openStream}.
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
    /** Called when the stream opens */
    onOpen?: () => void;
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
 * Options passed to {@link API.debouncedPlacemarkSearchBeta}.
 */
export interface placemarkSearchOptions {
    /** Location ID */
    locationID: string;
    /** Search String */
    searchStr: string;
    /**
     * Floor ID to be used in combination with `refPoint`
     * See {@link API.debouncedPlacemarkSearchBeta}
     */
    refFloorID?: string;
    /**
     * Map Point X/Y to be used in combination with `refFloorID`
     * See {@link API.debouncedPlacemarkSearchBeta}
     */
    refPoint?: string;
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
export declare class API {
    #private;
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
    /**
     * Pass the result to `init()` or `createMap()`.
     */
    constructor(options: APIOptions);
    /**
     * @deprecated
     * Use the fetch methods instead
     */
    get axios(): AxiosInstance;
    /**
     * [async] Returns an Object with routes to the destination (endPlacemarkID)
     */
    getDirections(options: getDirectionsOptions): Promise<Record<string, any>>;
    /**
     * [async] Returns an array of all tags on the specified location and floor
     */
    fetchTagsByFloor(locationID: string, floorID: string): Promise<TagData[]>;
    /**
     * [async] Returns an array of all tags at the specified location
     */
    fetchTagsByLocation(locationID: string): Promise<TagData[]>;
    /**
     * [async] Returns dynamicly updated data for a specific tag.
     */
    fetchTagDetail(mac: string): Promise<TagData>;
    /**
     * [async] Returns an array of all placemarks at the specified location
     */
    fetchPlacemarksByLocation(locationID: string): Promise<FloorData[]>;
    /**
     * [async] Returns an array of all placemarks on the specified location and
     * floor
     */
    fetchPlacemarksByFloor(locationID: string, floorID: string): Promise<FloorData[]>;
    /**
     * [async] Returns an array of all floors at the specified location
     */
    fetchFloorsByLocation(locationID: string): Promise<LocationData[]>;
    /**
     * [async] Returns the data of specified floor
     */
    fetchFloorData(locationID: string, floorID: string): Promise<FloorData>;
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
    fetchSVG(svgURL: string): Promise<string>;
    /**
     *
     * @experimental
     * [async] Returns an array of results or `null` when a request is cancelled
     * or debounced. Cancellation happens when a new request is made before the
     * previous request completes. The Debounce wait time is 6ms and the function
     * is invoked with the last arguments provided.
     *
     * Both cancelled and debounced requests will eventually resolve with an array
     * of results (possibly empty).
     *
     * Requests that throw an exception will return an empty array and output a
     * warning message to the Web console.
     *
     * Local/Nearby Search integration. If both refFloorID AND refPoint are
     * provided, a second API call will be made and the results will be ordered
     * where placemarks closest to the refPoint (x/y) will appear first.
     *
     * Placemark Search defaults to a single instance per API. This should work
     * fine for most use cases, but if you need to make multiple unique search
     * calls simultaneously, each will need a unique API instance like shown below.
     * ```ts
     * // Search Widget One API Instance.
     * const apiInstance1 = new MeridianSDK.API({
     *   token: "<TOKEN GOES HERE>"
     * });
     *
     * // Search Widget Two API Instance
     * const apiInstance2 = new MeridianSDK.API({
     *   token: "<TOKEN GOES HERE>"
     * });
     * ```
     */
    debouncedPlacemarkSearchBeta: (options: placemarkSearchOptions) => Promise<Record<string, any>[] | null>;
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
     *   onTagUpdate: (tag) => {
     *     console.log("update", tag);
     *   }
     * });
     *
     * // call `stream.close()` when switching pages to avoid leaving the stream
     * // open and wasting bandwidth in the background
     * ```
     */
    openStream({ locationID, floorID, resourceIDs, resourceType, onInitialTags, onTagUpdate, onException, onClose, onOpen, }: OpenStreamOptions): Stream;
}
/**
 * Environment name used in {@link APIOptions}. If unsure, use `"production"`.
 */
export type EnvOptions = "production" | "staging" | "eu" | "development" | "devCloud";
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
