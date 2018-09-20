import SocketIO from "socket.io-client";
import axios from "axios";

import { requiredParam } from "./util";

const envToTagURL = {
  development: "https://tags.meridianapps.com",
  production: "https://tags.meridianapps.com",
  staging: "https://staging-tags.meridianapps.com"
};

const tagPath = "/streams/v1beta2/tracking/websocket";

const envToRestURL = {
  development: "http://localhost:8091/websdk/api",
  production: "https://edit.meridianapps.com/websdk/api",
  staging: "https://staging-edit.meridianapps.com/websdk/api"
};

// We're not sure if we wanna expose streaming for all floors as an option
// externally, and we're only using it for lack of a REST endpoint internally.
// We could just use a string here, I guess. Personally I would want to use a
// Symbol() here but I don't want anything to do with Symbol "polyfills" in
// non-ES6 browsers.
export const STREAM_ALL_FLOORS = { const: "STREAM_ALL_FLOORS" };

export default class API {
  constructor({
    environment = "production",
    token = requiredParam("API", "token")
  }) {
    this.token = token;
    this.environment = environment;
    this.axios = axios.create({
      baseURL: envToRestURL[this.environment],
      headers: {
        Authorization: `Token ${token}`
      }
    });
  }

  // TODO
  // - We might want to just expose the Socket.IO client more directly here?
  // - Subscribe to all events listed here: https://github.com/arubanetworks/asset-tracking-backend/blob/master/components/tag-tracker/API.md
  // - We should probably work on the names of these callback functions
  openStream({
    locationID = requiredParam("openStream", "locationID"),
    floorID = requiredParam("openStream", "floorID"),
    onInitialTags = () => {},
    onTagUpdate = () => {},
    onTagLeave = () => {},
    onClose = () => {},
    onException = () => {}
  }) {
    const connection = SocketIO.connect(
      envToTagURL[this.environment],
      { path: tagPath, transports: ["websocket"] }
    );
    const authenticate = () => {
      connection.emit("authenticate", {
        locationID,
        token: this.token
      });
    };
    const subscribe = () => {
      // Make sure you have to explicitly opt-in to streaming all floors data
      if (floorID === STREAM_ALL_FLOORS) {
        connection.emit("subscribe", { locationID });
      } else {
        connection.emit("subscribe", {
          locationID,
          mapID: floorID
        });
      }
    };
    connection.on("connect", authenticate);
    connection.on("connect_error", onClose);
    connection.on("disconnect", onClose);
    connection.on("exception", onException);
    connection.on("authenticated", subscribe);
    connection.on("unauthenticated", onClose);
    connection.on("assets", onInitialTags);
    connection.on("asset_update", onTagUpdate);
    connection.on("asset_delete", onTagLeave);
    return {
      close: () => connection.close()
    };
  }
}
