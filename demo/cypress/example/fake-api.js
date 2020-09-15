import mockMaps from "./mock-maps.js";
import mockPlacemarks from "./mock-placemarks.js";
import mockSvg from "./mock-svg.js";

function missingPropertyProxy(name, target) {
  return new Proxy(target, {
    get(target, property) {
      if (property in target) {
        return target[property];
      }
      if (typeof property !== "symbol" && !property.startsWith("@")) {
        console.warn(`[${name}] missing property "${property}"`);
      }
      return undefined;
    }
  });
}

class FakeAxios {
  toRoute(url) {
    const path = new URL(url, "http://example.com").pathname;
    return path.replace(/[0-9_]+/g, () => "*");
  }

  async get(url) {
    const route = this.toRoute(url);
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

  async post() {
    throw new Error("TODO: FakeAxios.post");
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
    onInitialTags([]);
    return { close() {} };
  }
}

export const fakeAPI = missingPropertyProxy("API", new FakeAPI());
