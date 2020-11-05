/**
 * @internal
 * @packageDocumentation
 */

export function deprecated(...args: any[]) {
  // eslint-disable-next-line no-console
  console.warn("[deprecated]", ...args);
}

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

export function getPlacemarkIconURL(type: string) {
  const name = "placemark-" + type.replace(/_/g, "-");
  return getAssetURL(`placemarks/${name}.svg`);
}

export function validateEnvironment(env: string): boolean {
  return (
    env === "staging" ||
    env === "production" ||
    env === "eu" ||
    env === "development" ||
    env === "devCloud"
  );
}
