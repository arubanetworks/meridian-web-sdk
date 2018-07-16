import SocketIO from "socket.io-client";
import axios from "axios";

import { requiredParam } from "./util";

const envToTagURL = {
  production: "https://tags.meridianapps.com",
  staging: "https://staging-tags.meridianapps.com"
};

const tagPath = "/streams/v1beta2/tracking/websocket";

const envToRestURL = {
  production: "https://edit.meridianapps.com/api",
  staging: "https://staging-edit.meridianapps.com/api"
};

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
    onTagDisappear = () => {},
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
      connection.emit("subscribe", {
        locationID,
        mapID: floorID
      });
    };
    connection.on("connect", authenticate);
    connection.on("connect_error", onClose);
    connection.on("disconnect", onClose);
    connection.on("exception", onException);
    connection.on("authenticated", subscribe);
    connection.on("unauthenticated", onClose);
    connection.on("assets", onInitialTags);
    connection.on("asset_update", onTagUpdate);
    connection.on("asset_delete", onTagDisappear);
    return {
      close: () => connection.close()
    };
  }
}
