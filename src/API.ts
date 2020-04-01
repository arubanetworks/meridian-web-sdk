import axios, { AxiosInstance } from "axios";
import ReconnectingWebSocket from "reconnecting-websocket";

import { requiredParam, asyncClientCall } from "./util";

const envToTagTrackerRestURL = {
  development: "http://localhost:8091/api/v1/track/assets",
  devCloud: "https://dev-tags.meridianapps.com/api/v1/track/assets",
  production: "https://tags.meridianapps.com/api/v1/track/assets",
  eu: "https://tags-eu.meridianapps.com/api/v1/track/assets",
  staging: "https://staging-tags.meridianapps.com/api/v1/track/assets"
} as const;

const envToTagTrackerStreamingURL = {
  development: "ws://localhost:8091/streams/v1/track/assets",
  devCloud: "wss://dev-tags.meridianapps.com/streams/v1/track/assets",
  production: "wss://tags.meridianapps.com/streams/v1/track/assets",
  eu: "wss://tags-eu.meridianapps.com/streams/v1/track/assets",
  staging: "wss://staging-tags.meridianapps.com/streams/v1/track/assets"
} as const;

const envToEditorRestURL = {
  development: "http://localhost:8091/websdk/api",
  devCloud: "https://dev-edit.meridianapps.com/websdk/api",
  production: "https://edit.meridianapps.com/websdk/api",
  eu: "https://edit-eu.meridianapps.com/websdk/api",
  staging: "https://staging-edit.meridianapps.com/websdk/api"
} as const;

export type EnvOptions = "production" | "staging" | "eu" | "development";
export type APIOptions = { environment: EnvOptions; token: string };

export async function fetchTagsByFloor(options: {
  api: API;
  locationID: string;
  floorID: string;
}) {
  const response = await options.api.axios.post(
    envToTagTrackerRestURL[options.api.environment],
    {
      floor_id: options.floorID,
      location_id: options.locationID
    }
  );
  return response.data.asset_updates;
}

export async function fetchTagsByLocation(options: {
  api: API;
  locationID: string;
}) {
  const response = await options.api.axios.post(
    envToTagTrackerRestURL[options.api.environment],
    {
      location_id: options.locationID
    }
  );
  return response.data.asset_updates;
}

type Stream = {
  close: () => void;
};

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
      baseURL: envToEditorRestURL[this.environment],
      headers: {
        Authorization: `Token ${options.token}`
      }
    });
  }

  openStream(options: {
    locationID: string;
    floorID: string;
    onInitialTags?: (tags: Record<string, any>[]) => void;
    onTagLeave?: (tag: Record<string, any>) => void;
    onTagUpdate?: (tag: Record<string, any>) => void;
    onException?: (error: Error) => void;
    onClose?: () => void;
  }): Stream {
    if (!options.locationID) {
      requiredParam("openStream", "locationID");
    }
    if (!options.floorID) {
      requiredParam("openStream", "floorID");
    }
    const params = new URLSearchParams();
    params.set("method", "POST");
    params.set("authorization", `Token ${this.token}`);
    const url = envToTagTrackerStreamingURL[this.environment];
    const ws = new ReconnectingWebSocket(`${url}?${params}`);
    const request = {
      asset_requests: [
        {
          resource_type: "LOCATION",
          location_id: options.locationID
        }
      ]
    };
    fetchTagsByFloor({
      api: this,
      locationID: options.locationID,
      floorID: options.floorID
    }).then(response => {
      options.onInitialTags?.(response.data?.asset_updates ?? []);
    });
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify(request));
    });
    ws.addEventListener("message", event => {
      const data = JSON.parse(event.data);
      if (data.error) {
        options.onException?.(new Error(data.error.message));
        return;
      }
      if (data.result) {
        for (const assetUpdate of data.result.asset_updates) {
          const eventType = assetUpdate.event_type;
          if (eventType === "DELETE") {
            if (options.onTagLeave) {
              asyncClientCall(options.onTagLeave, assetUpdate);
            }
          } else if (eventType === "UPDATE") {
            if (options.onTagUpdate) {
              asyncClientCall(options.onTagUpdate, assetUpdate);
            }
          } else {
            throw new Error(`Unknown event type: ${eventType}`);
          }
        }
        return;
      }
      throw new Error(`Unknown message: ${event.data}`);
    });
    ws.addEventListener("error", () => {
      options.onException?.(
        new Error("MeridianSDK.openStream connection error")
      );
    });
    ws.addEventListener("close", () => {
      options.onClose?.();
    });
    return {
      close: () => ws.close()
    };
  }
}
