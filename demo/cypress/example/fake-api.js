import mockMaps from "./mock-maps.js";
import mockPlacemarks from "./mock-placemarks.js";
import mockSvg from "./mock-svg.js";
import mockAssets from "./mock-assets.js";

// Show console warnings when accessing an undefined property, so it's easier to
// develop these fake APIs
function missingPropertyProxy(name, target) {
  return new Proxy(target, {
    get(target, property) {
      if (property in target) {
        return target[property];
      }
      if (typeof property !== "symbol" && !property.startsWith("@")) {
        // eslint-disable-next-line no-console
        console.warn(`[${name}] missing property "${property}"`);
      }
      return undefined;
    }
  });
}

function toRoute(url) {
  const path = new URL(url, "http://example.com").pathname;
  // Replace IDs with * so we can ignore them easier
  return path.replace(/\/[0-9_]+/g, () => "/*");
}

class FakeAxios {
  async get(url) {
    const route = toRoute(url);
    if (route === "/locations/*/maps") {
      return { data: mockMaps };
    } else if (route === "/locations/*/maps/*/placemarks") {
      return { data: mockPlacemarks };
    } else if (route.endsWith(".svg")) {
      return { data: new Blob([mockSvg], { type: "image/svg+xml" }) };
    } else {
      throw new Error(`unknown route "${route}"`);
    }
  }

  async post(url) {
    const route = toRoute(url);
    if (route === "/api/v1/track/assets") {
      return { data: mockAssets };
    } else {
      throw new Error(`unknown route "${route}"`);
    }
  }
}

class FakeAPI {
  constructor() {
    this.environment = "production";
    this.axios = missingPropertyProxy("API.axios", new FakeAxios());
  }

  openStream({
    // locationID,
    // floorID,
    onInitialTags
    // onTagLeave,
    // onTagUpdate,
    // onException,
    // onClose
  }) {
    // TODO: Return some actual tags
    onInitialTags(mockAssets.asset_updates);
    return { close() {} };
  }
}

export const fakeAPI = missingPropertyProxy("API", new FakeAPI());
