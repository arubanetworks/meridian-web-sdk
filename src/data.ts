// NOTE: This file is exported as-is from web-sdk!
// All types should be fully documented

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
