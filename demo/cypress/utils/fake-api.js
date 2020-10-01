import mockMaps from "./mock-maps.js";
import mockPlacemarks from "./mock-placemarks.js";
import mockSvg from "./mock-svg.js";
import mockAllAssets from "./mock-all-assets.js";
import mockFloorAssets from "./mock-floor-assets.js";

// Show console warnings when accessing an undefined property, so it's easier to
// develop these fake APIs
function missingPropertyProxy(name, target) {
  return new Proxy(target, {
    get(target, property) {
      if (property in target) {
        return target[property];
      }
      // Some library is trying to read various strange properties we don't
      // implement, so let's ignore those isntead of showing a warning
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

async function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

class FakeAxios {
  async get(url) {
    await sleep(0);
    const route = toRoute(url);
    if (route === "/locations/*/maps") {
      return { data: mockMaps };
    } else if (route === "/locations/*/maps/*/placemarks") {
      const mapID = url.split("/")[3];
      const placemarksOnFloor = mockPlacemarks.results.filter(
        item => item.map === mapID
      );
      return { data: { ...mockPlacemarks, results: placemarksOnFloor } };
    } else if (route.endsWith(".svg")) {
      return { data: new Blob([mockSvg], { type: "image/svg+xml" }) };
    } else {
      throw new Error(`unknown route "${route}"`);
    }
  }

  async post(url) {
    await sleep(0);
    const route = toRoute(url);
    if (route === "/api/v1/track/assets") {
      return { data: mockAllAssets };
    } else {
      throw new Error(`unknown route "${route}"`);
    }
  }
}

class FakeAPI {
  constructor() {
    this.token = "[FAKE_TOKEN]";
    this.environment = "production";
    this.axios = missingPropertyProxy("API.axios", new FakeAxios());
  }

  openStream({
    // locationID,
    floorID: mapID,
    onInitialTags
    // onTagLeave,
    // onTagUpdate,
    // onException,
    // onClose
  }) {
    sleep(0).then(() => {
      const assetsOnFloor = mockFloorAssets.filter(
        item => item.map_id === mapID
      );
      onInitialTags(assetsOnFloor);
    });
    return { close() {} };
  }
}

export const fakeAPI = missingPropertyProxy("API", new FakeAPI());
