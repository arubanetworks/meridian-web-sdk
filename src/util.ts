/**
 * @internal
 * @packageDocumentation
 */

import { TagData } from "./data";
import { EnvOptions } from "./web-sdk";

const consoleTag = "[@meridian/web-sdk]";
// eslint-disable-next-line no-console
export const logWarn = console.warn.bind(console, consoleTag);
// eslint-disable-next-line no-console
export const logError = console.error.bind(console, consoleTag);
export const logDeprecated = logWarn.bind(null, "[deprecated]");

export const uiText = {
  enDash: "–",
  unnamedBuilding: "Unassigned",
  noResultsFound: "No results found."
};

export function objectWithoutKey<T>(object: T, key: keyof typeof object): T {
  const newObject = { ...object };
  delete newObject[key];
  return newObject;
}

/** Like lodash.groupBy, but the values are not in arrays. */
export function keyBy<T, K extends string | number | symbol>(
  data: T[],
  fn: (item: T) => K
): Record<K, T> {
  const ret = {} as Record<K, T>;
  for (const item of data) {
    ret[fn(item)] = item;
  }
  return ret;
}

export function createSearchMatcher(query: string) {
  return (target: string) =>
    target.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0;
}

export function getTagLabels(tag: TagData) {
  return (tag.tags || []).map((tag: Record<string, any>) => tag.name);
}

export function requiredParam(funcName: string, argName: string) {
  logError(`${funcName}: argument \`${argName}\` is required`);
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
export function asyncClientCall<T extends any[]>(
  func: (...args: T) => void,
  ...args: T
) {
  setTimeout(func, 0, ...args);
}

export function isEnvOptions(env: string): env is EnvOptions {
  return (
    env === "staging" ||
    env === "production" ||
    env === "eu" ||
    env === "development" ||
    env === "devCloud"
  );
}
