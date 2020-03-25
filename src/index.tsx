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

// This is kinda irritating, but importing package.json just to get the version
// is a waste of kilobytes, so we're using webpack's DefinePlugin to do a macro

type APIContext = {
  api?: AxiosInstance;
};

const context: APIContext = {
  api: undefined
};

/* global GLOBAL_VERSION */
export const version = GLOBAL_VERSION;

export function restrictedPanZoom(event: TouchEvent | WheelEvent | MouseEvent) {
  if (event instanceof WheelEvent && !event.shiftKey) {
    return false;
  } else if (event instanceof TouchEvent) {
    return event.touches.length >= 2;
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

type MapProps = CreateMapOptions & {
  youAreHerePlacemarkID?: string;
  // TODO: Internal only, remove
  update: (newProps: MapProps) => void;
  // TODO: `onMarkerClick` is internal only, we should remove from public types
  onMarkerClick?: (marker: Record<string, any>) => void;
  // TODO: `onMapClick` is not used or documented, we should delete it
  onMapClick?: (event: MouseEvent) => void;
  api: AxiosInstance;
};

export function createMap(node: HTMLElement, options: CreateMapOptions) {
  if (!node) {
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
      node,
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
  const update = (updatedOptions: Partial<MapProps>) => {
    _update(updatedOptions, { internalUpdate: false });
  };
  const zoomToDefault = () => {
    mapRef?.zoomToDefault();
  };

  type ZoomToPointOptions = {
    x: number;
    y: number;
    scale: number;
  };

  function zoomToPoint(options: ZoomToPointOptions) {
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

  let domRef: HTMLElement = render(
    <Map api={context.api} update={_update} {...options} ref={setMapRef} />,
    node
  ) as any;
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
