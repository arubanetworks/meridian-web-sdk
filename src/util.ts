/**
 * @internal
 * @packageDocumentation
 */

import { API } from "./web-sdk";

const ASSETS_URL =
  "https://files.meridianapps.com/meridian-web-sdk-assets/0.2.0";

export const STRINGS = {
  enDash: "–",
  unnamedBuilding: "Unassigned",
  noResultsFound: "No results found."
};

export function objectWithoutKey<T>(object: T, key: keyof typeof object): T {
  const newObject = { ...object };
  delete newObject[key];
  return newObject;
}

export function createSearchMatcher(query: string) {
  return (target: string) =>
    target.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0;
}

export function getTagLabels(tag: Record<string, any>) {
  return (tag.tags || []).map((tag: Record<string, any>) => tag.name);
}

export function requiredParam(funcName: string, argName: string) {
  // eslint-disable-next-line no-console
  console.error(`${funcName}: argument \`${argName}\` is required`);
}

/**
 * The point of asyncClientCall is that calls a callback on the next tick of the
 * event loop so that client callbacks don't cause errors within our code
 *
 * ```js
 * var foo = this.getFoo();
 * asyncClientCall(this.callback, foo);
 * // ^---- client error happens later, allowing `getBar` to be called
 * var bar = this.getBar();
 * ```
 * @internal
 */
export function asyncClientCall(
  func: (...args: any[]) => void,
  ...args: any[]
) {
  setTimeout(func, 0, ...args);
}

export function getAssetURL(suffix: string) {
  return `${ASSETS_URL}/${suffix}`;
}

/**
 * TODO: Actually document this, enable the feature, stop using Record<string,
 * any>, etc etc.
 * @internal
 */
export function getDirections({
  api,
  locationID,
  fromMapID,
  fromPlacemarkID,
  toPlacemarkID
}: Record<string, any>) {
  return api.axios.get(`/locations/${locationID}/directions`, {
    params: {
      from_map_id: fromMapID,
      from_placemark_id: fromPlacemarkID,
      to_placemark_ids: toPlacemarkID
    }
  });
}

export function getPlacemarkIconURL(type: string) {
  const name = "placemark-" + type.replace(/_/g, "-");
  return getAssetURL(`placemarks/${name}.svg`);
}

export async function fetchAllPaginatedData<T>(
  api: API,
  url: string
): Promise<T[]> {
  const { data } = await api.axios.get(url);
  const results = data.results;
  let next = data.next;
  while (next) {
    const { data } = await api.axios.get(next);
    results.push(...data.results);
    next = data.next;
  }
  return results;
}

export function validateEnvironment(env: string) {
  return (
    env === "staging" ||
    env === "production" ||
    env === "eu" ||
    env === "development" ||
    env === "devCloud"
  );
}

export async function fetchTagsByFloor(options: {
  api: API;
  locationID: string;
  floorID: string;
}): Promise<Record<string, any>[]> {
  const response = await options.api.axios.post(
    envToTagTrackerRestURL[options.api.environment],
    {
      floor_id: options.floorID,
      location_id: options.locationID
    }
  );
  return response.data.asset_updates;
}

export async function fetchTagsByLocation(options: {
  api: API;
  locationID: string;
}): Promise<Record<string, any>[]> {
  const response = await options.api.axios.post(
    envToTagTrackerRestURL[options.api.environment],
    {
      location_id: options.locationID
    }
  );
  return response.data.asset_updates;
}

export const envToTagTrackerRestURL = {
  development: "http://localhost:8091/api/v1/track/assets",
  devCloud: "https://dev-tags.meridianapps.com/api/v1/track/assets",
  production: "https://tags.meridianapps.com/api/v1/track/assets",
  eu: "https://tags-eu.meridianapps.com/api/v1/track/assets",
  staging: "https://staging-tags.meridianapps.com/api/v1/track/assets"
} as const;

export const envToTagTrackerStreamingURL = {
  development: "ws://localhost:8091/streams/v1/track/assets",
  devCloud: "wss://dev-tags.meridianapps.com/streams/v1/track/assets",
  production: "wss://tags.meridianapps.com/streams/v1/track/assets",
  eu: "wss://tags-eu.meridianapps.com/streams/v1/track/assets",
  staging: "wss://staging-tags.meridianapps.com/streams/v1/track/assets"
} as const;

export const envToEditorRestURL = {
  development: "http://localhost:8091/websdk/api",
  devCloud: "https://dev-edit.meridianapps.com/websdk/api",
  production: "https://edit.meridianapps.com/websdk/api",
  eu: "https://edit-eu.meridianapps.com/websdk/api",
  staging: "https://staging-edit.meridianapps.com/websdk/api"
} as const;
