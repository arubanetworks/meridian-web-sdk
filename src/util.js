import objectValues from "lodash.values";

const ASSETS_URL =
  "https://storage.googleapis.com/meridian-web-sdk-assets/0.0.1-beta6";

export function ungroup(groupedData) {
  return objectValues(groupedData).reduce((a, b) => a.concat(b), []);
}

export function doesSearchMatch(query, target) {
  return target.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0;
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

export function getPlacemarkIconURL(type) {
  const name = "placemark-" + type.replace(/_/g, "-");
  return getAssetURL(`placemarks/${name}.svg`);
}

export function normalizeTag(tag) {
  const { mac, editor_data: data } = tag;
  const { name, image_url: imageURL } = data;
  const {
    x,
    y,
    location_id: locationID,
    map_id: floorID
  } = tag.calculations.default.location;
  const labels = tag.editor_data.tags.map(x => x.name);
  return {
    name,
    mac,
    x,
    y,
    imageURL,
    locationID,
    floorID,
    labels,
    data,
    rawData: tag
  };
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
