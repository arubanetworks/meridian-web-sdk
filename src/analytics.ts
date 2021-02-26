/**
 * @internal
 * @packageDocumentation
 */

import axios from "axios";

import { version } from "./web-sdk";

const pixelRatio = window.devicePixelRatio || 1;
const screen = window.screen;
const screenRes = `${screen.width * pixelRatio}x${screen.height * pixelRatio}`;

interface SendAnalyticsCodeEventOptions {
  action: string;
  locationID: string;
  onTagsUpdate?: boolean;
  tagsFilter?: boolean;
  placemarksFilter?: boolean;
  internalUpdate?: boolean;
}

export async function sendAnalyticsCodeEvent(
  options: SendAnalyticsCodeEventOptions
) {
  // Skip Google Analytics when using Cypress automation testing
  if ("Cypress" in window) {
    return;
  }
  const {
    action,
    locationID,
    onTagsUpdate = false,
    tagsFilter = false,
    placemarksFilter = false,
    internalUpdate = false
  } = options;
  const params = {
    v: "1", // GA version
    tid: "UA-56747301-5", // Tracking ID
    an: "MeridianSDK", // Application Name
    ds: "app", // Data Source
    av: version, // Application Version
    uid: locationID, // User ID
    cid: locationID, // Client ID
    t: "event", // Hit Type
    ec: "code", // Event Category
    ea: action, // Event Action
    ev: 1, // Event Value
    el: internalUpdate ? "internal" : "external", // Event Label
    cm1: onTagsUpdate ? 1 : 0, // Custom Metric
    cm2: tagsFilter ? 1 : 0, // Custom Metric
    cm3: placemarksFilter ? 1 : 0, // Custom Metric
    ul: navigator.language, // User Language
    sr: screenRes, // Screen Resolution
    aip: 1, // Anonymize IP
    ua: window.navigator.userAgent, // User Agent
    z: Math.random()
      .toString(36)
      .substring(7) // Cache Buster (per google)
  };
  axios.get("https://www.google-analytics.com/collect", { params });
}
