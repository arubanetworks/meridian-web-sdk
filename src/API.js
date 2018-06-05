import SocketIO from "socket.io-client";
import axios from "axios";

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
  constructor({ environment, token }) {
    this.token = token;
    this.environment = environment;
    this.axios = axios.create({
      baseURL: envToRestURL[this.environment],
      headers: {
        Authorization: `Token ${token}`
      }
    });
  }

  openStream({
    locationId,
    floorId,
    onTagUpdate = () => {},
    onClose = () => {},
    onException = () => {}
  }) {
    const connection = SocketIO.connect(
      envToTagURL[this.environment],
      { path: tagPath, transports: ["websocket"] }
    );
    const authenticate = () => {
      connection.emit("authenticate", {
        locationID: locationId,
        token: this.token
      });
    };
    const subscribe = () => {
      connection.emit("subscribe", {
        locationID: locationId,
        mapID: floorId
      });
    };
    connection.on("connect", authenticate);
    connection.on("connect_error", onClose);
    connection.on("disconnect", onClose);
    connection.on("exception", onException);
    connection.on("authenticated", subscribe);
    connection.on("unauthenticated", onClose);
    connection.on("asset_update", onTagUpdate);
    return {
      close: () => connection.close()
    };
  }
}
