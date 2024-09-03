/**
 * @internal
 * @packageDocumentation
 */
export declare const logWarn: (...args: any[]) => void;
export declare const logError: (...args: any[]) => void;
export declare const logDeprecated: (...args: any[]) => void;
export declare const uiText: {
    enDash: string;
    unnamedBuilding: string;
};
/** New object with just one key missing from it. */
export declare function objectWithoutKey<T>(object: T, key: keyof typeof object): T;
/** Like lodash.groupBy, but the values are not in arrays. */
export declare function keyBy<T, K extends string | number | symbol>(data: T[], fn: (item: T) => K): Record<K, T>;
export declare function createSearchMatcher(query: string): (target: string) => boolean;
export declare function getTagLabels(tag: TagData): any;
export declare function getPlacemarkCategories(placemark: PlacemarkData): any;
export declare function requiredParam(funcName: string, argName: string): void;
export declare function isEnvOptions(env: string): env is EnvOptions;
export declare function cleanQuery(query: string): string;
export declare const placemarkSearchParams = "is_map_published=true AND kind:placemark AND NOT is_searchable=false AND NOT type=exclusion_area";
export declare function debouncedPlacemarkSearch(func: any, wait?: number): () => Promise<unknown>;
