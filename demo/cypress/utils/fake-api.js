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

async function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

class FakeAPI {
  constructor() {
    this.token = "[FAKE_TOKEN]";
    this.environment = "production";
  }

  async fetchTagsByFloor(_locationID, floorID) {
    await sleep(0);
    return mockFloorAssets.filter(item => item.map_id === floorID);
  }

  async fetchTagsByLocation() {
    await sleep(0);
    return mockAllAssets.asset_updates;
  }

  async fetchPlacemarksByFloor(_locationID, floorID) {
    await sleep(0);
    return mockPlacemarks.results.filter(item => item.map === floorID);
  }

  async fetchFloorsByLocation() {
    await sleep(0);
    return mockMaps.results;
  }

  async fetchSVG() {
    await sleep(0);
    const blob = new Blob([mockSvg], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
  }

  openStream({
    locationID,
    floorID,
    onInitialTags
    // onTagLeave,
    // onTagUpdate,
    // onException,
    // onClose
  }) {
    this.fetchTagsByFloor(locationID, floorID).then(tags => {
      onInitialTags(tags);
    });
    return {
      close() {}
    };
  }
}

export const fakeAPI = missingPropertyProxy("API", new FakeAPI());
