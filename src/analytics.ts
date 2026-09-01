/**
 * @internal
 * @packageDocumentation
 */

import { version } from "./web-sdk";

const pixelRatio = window.devicePixelRatio || 1;
const screen = window.screen;
const screenRes = `${screen.width * pixelRatio}x${screen.height * pixelRatio}`;

interface SendAnalyticsCodeEventOptions {
  action: string;
  locationID: string;
  analyticsEndpoint?: string;
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
    analyticsEndpoint,
    onTagsUpdate = false,
    tagsFilter = false,
    placemarksFilter = false,
    internalUpdate = false,
  } = options;
  // Opt-in; analyticsEndpoint should point to your own server, never at GA with a secret in the URL.
  if (!analyticsEndpoint) {
    return;
  }
  const params = {
    session_id: locationID, // Needed to show in realtime reports
    v: "1", // GA version
    app_name: "MeridianSDK", // Application Name
    data_src: "app", // Data Source
    app_version: version, // Application Version
    uid: locationID, // User ID
    cid: locationID, // Client ID
    hit_type: "event", // Hit Type
    event_category: "code", // Event Category
    event_action: action, // Event Action
    event_value: 1, // Event Value
    event_label: internalUpdate ? "internal" : "external", // Event Label
    tag_update: onTagsUpdate ? 1 : 0, // Custom Metric
    tags_filter: tagsFilter ? 1 : 0, // Custom Metric
    placemarks_filter: placemarksFilter ? 1 : 0, // Custom Metric
    language: navigator.language, // User Language
    screen_res: screenRes, // Screen Resolution
    anonymize_ip: 1, // Anonymize IP
    user_agent: window.navigator.userAgent, // User Agent
    z: Math.random().toString(36).substring(7), // Cache Buster (per google)
  };

  fetch(analyticsEndpoint, {
    method: "POST",
    body: JSON.stringify({
      client_id: locationID,
      events: [
        {
          name: "page_event",
          params: {
            ...params,
          },
        },
      ],
    }),
  });
}
