/* eslint-disable no-console */
/* global MeridianSDK */

import { fakeAPI } from "./fake-api.js";

const root = document.getElementById("meridian-map");
const map = MeridianSDK.createMap(root, {
  api: fakeAPI,
  locationID: "5198682008846336",
  floorID: "5755685136498688",
  height: "100%"
});

console.log(map);
