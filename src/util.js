const ASSETS_URL =
  "https://files.meridianapps.com/meridian-web-sdk-assets/0.2.0";

export const STRINGS = {
  enDash: "–",
  unnamedBuilding: "Unassigned",
  noResultsFound: "No results found."
};

export function createSearchMatcher(query) {
  return target =>
    target.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0;
}

export function getTagLabels(tag) {
  return (tag.tags || []).map(tag => tag.name);
}

export function requiredParam(funcName, argName) {
  // eslint-disable-next-line no-console
  console.error(`${funcName}: argument \`${argName}\` is required`);
}

// The point of asyncClientCall is that calls a callback on the next tick of the
// event loop so that client callbacks don't cause errors within our code
//
// Example:
//
// var foo = this.getFoo();
// asyncClientCall(this.callback, foo);
// ^---- client error happens later, allowing `getBar` to be called
// var bar = this.getBar();
export function asyncClientCall(func, ...args) {
  setTimeout(func, 0, ...args);
}

export function getAssetURL(suffix) {
  return `${ASSETS_URL}/${suffix}`;
}

export function getDirections({
  api,
  locationID,
  fromMapID,
  fromPlacemarkID,
  toPlacemarkID
}) {
  return api.axios.get(`/locations/${locationID}/directions`, {
    params: {
      from_map_id: fromMapID,
      from_placemark_id: fromPlacemarkID,
      to_placemark_ids: toPlacemarkID
    }
  });
}

export function getPlacemarkIconURL(type) {
  const name = "placemark-" + type.replace(/_/g, "-");
  return getAssetURL(`placemarks/${name}.svg`);
}

export async function fetchAllPaginatedData(api, url) {
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

// TODO stream (use non-stream endpoint)
export async function fetchAllTags({ api, locationID, floorID }) {
  return new Promise(resolve => {
    const stream = api.openStream({
      locationID,
      floorID,
      onInitialTags: tags => {
        resolve(tags);
        stream.close();
      }
    });
  });
}

export function validateEnvironment(env) {
  return (
    env === "staging" ||
    env === "production" ||
    env === "eu" ||
    env === "development" ||
    env === "devCloud"
  );
}
