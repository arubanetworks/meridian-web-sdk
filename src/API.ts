import axios, { AxiosInstance } from "axios";

import { requiredParam } from "./util";

const envToTagURL = {
  //Update the environment from development to eu per Marc
  development: "https://tags.meridianapps.com",
  devCloud: "https://dev-tags.meridianapps.com",
  production: "https://tags.meridianapps.com",
  eu: "https://tags-eu.meridianapps.com",
  staging: "https://staging-tags.meridianapps.com/api/v1/track/assets"
} as const;

const envToRestURL = {
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
  return await options.api.axios.post(envToTagURL[options.api.environment], {
    floor_id: options.floorID,
    location_id: options.locationID
  });
}

export async function fetchTagsByLocation(options: {
  api: API;
  locationID: string;
}) {
  return await options.api.axios.post(envToTagURL[options.api.environment], {
    location_id: options.locationID
  });
}

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

  openStream(options: {
    locationID: string;
    floorID: string;
    onInitialTags?: (tags: Record<string, any>[]) => void;
    onTagLeave?: (tag: Record<string, any>) => void;
    onTagUpdate?: (tag: Record<string, any>) => void;
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
      `wss://staging-tags.meridianapps.com/streams/v1/track/assets?method=POST&authorization=Token%20${this.token}`
    );
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
      // TODO decide whether to call onTagUpdate or onTagLeave
      if (data.error) {
        options.onException?.(new Error(data.error.message));
      } else if (data.result) {
        options.onTagUpdate?.(data.result.asset_updates[0]);
      }
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
