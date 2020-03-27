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

// TODO stream
const tagPath = "/streams/v1beta2/tracking/websocket";

const envToRestURL = {
  development: "http://localhost:8091/websdk/api",
  devCloud: "https://dev-edit.meridianapps.com/websdk/api",
  production: "https://edit.meridianapps.com/websdk/api",
  eu: "https://edit-eu.meridianapps.com/websdk/api",
  staging: "https://staging-edit.meridianapps.com/websdk/api"
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

  // TODO stream
  openStream(options: {
    locationID: string;
    floorID: string;
    onInitialTags?: (tags: Record<string, any>[]) => void;
    onTagUpdate?: (tag: Record<string, any>) => void;
    onTagLeave?: (tag: Record<string, any>) => void;
    onClose?: () => void;
    onException?: (error: Error) => void;
  }) {
    // TODO: Add re-connect logic?
    if (!options.locationID) {
      requiredParam("openStream", "locationID");
    }
    if (!options.floorID) {
      requiredParam("openStream", "floorID");
    }
    const ws = new WebSocket(
      `wss://staging-tags.meridianapps.com/streams/v1/track/assets?method=POST&authorization=Bearer+${this.token}`
    );
    const request = {
      asset_requests: [
        {
          resource_type: "LOCATION",
          location_id: options.locationID
        }
      ]
    };
    ws.addEventListener("open", event => {
      console.log(event);
      ws.send(JSON.stringify(request));
    });
    ws.addEventListener("message", event => {
      console.log("message", JSON.parse(event.data));
    });
    ws.addEventListener("error", event => {
      console.log("error", event);
    });
    ws.addEventListener("close", event => {
      console.log("close", event);
      options.onClose?.();
    });
    return {
      close: () => ws.close()
    };
  }
}
