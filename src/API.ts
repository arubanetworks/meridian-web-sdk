import SocketIO from "socket.io-client";
import axios, { AxiosInstance } from "axios";

import { requiredParam } from "./util";

const envToTagURL = {
  development: "https://tags.meridianapps.com",
  devCloud: "https://dev-tags.meridianapps.com",
  production: "https://tags.meridianapps.com",
  eu: "https://tags-eu.meridianapps.com",
  staging: "https://staging-tags.meridianapps.com"
};

const tagPath = "/streams/v1beta2/tracking/websocket";

const envToRestURL = {
  development: "http://localhost:8091/websdk/api",
  devCloud: "https://dev-edit.meridianapps.com/websdk/api",
  production: "https://edit.meridianapps.com/websdk/api",
  eu: "https://edit-eu.meridianapps.com/websdk/api",
  staging: "https://staging-edit.meridianapps.com/websdk/api"
};

type OpenStreamOptions = {
  locationID: string;
  floorID: string;
  onInitialTags?: (tags: Record<string, any>[]) => void;
  onTagUpdate?: (tag: Record<string, any>) => void;
  onTagLeave?: (tag: Record<string, any>) => void;
  onClose?: () => void;
  onException?: (error: Error) => void;
};

// This is intentionally not exported from package as a whole
export const STREAM_ALL_FLOORS =
  "__secret_internal_stream_all_floors_DO_NOT_USE";

export type EnvOptions = "production" | "staging" | "eu" | "development";
export type APIOptions = { environment: EnvOptions; token: string };

export default class API {
  token: string;
  environment: EnvOptions;
  axios: AxiosInstance;

  constructor(options: APIOptions) {
    if (!options.token) {
      requiredParam("API", "token");
    }
    this.token = options.token;
    this.environment = options.environment || "production";
    this.axios = axios.create({
      baseURL: envToRestURL[this.environment],
      headers: {
        Authorization: `Token ${options.token}`
      }
    });
  }

  openStream(options: OpenStreamOptions) {
    if (!options.locationID) {
      requiredParam("openStream", "locationID");
    }
    if (!options.floorID) {
      requiredParam("openStream", "floorID");
    }
    const emptyFn = () => {};
    const connection = SocketIO.connect(envToTagURL[this.environment], {
      path: tagPath,
      transports: ["websocket"]
    });
    const authenticate = () => {
      connection.emit("authenticate", {
        locationID: options.locationID,
        token: this.token
      });
    };
    const subscribe = () => {
      // Make sure you have to explicitly opt-in to streaming all floors data
      if (options.floorID === STREAM_ALL_FLOORS) {
        connection.emit("subscribe", { locationID: options.locationID });
      } else {
        connection.emit("subscribe", {
          locationID: options.locationID,
          mapID: options.floorID
        });
      }
    };
    connection.on("connect", authenticate);
    connection.on("connect_error", options.onClose || emptyFn);
    connection.on("disconnect", options.onClose || emptyFn);
    connection.on("exception", options.onException || emptyFn);
    connection.on("authenticated", subscribe);
    connection.on("unauthenticated", options.onClose || emptyFn);
    connection.on("assets", options.onInitialTags || emptyFn);
    connection.on("asset_update", options.onTagUpdate || emptyFn);
    connection.on("asset_delete", options.onTagLeave || emptyFn);
    return {
      close: () => connection.close()
    };
  }
}
