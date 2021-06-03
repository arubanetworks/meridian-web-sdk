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
    this._live = false;
    this._loadTime = 1000;
    this._updateInterval = 2000;
  }

  async _sleep() {
    await sleep(this._live ? this._loadTime : 0);
  }

  async fetchTagsByFloor(_locationID, floorID) {
    await this._sleep();
    return mockFloorAssets.filter(item => item.map_id === floorID);
  }

  async fetchTagsByLocation() {
    await this._sleep();
    return mockAllAssets.asset_updates;
  }

  async fetchPlacemarksByFloor(_locationID, floorID) {
    await this._sleep();
    return mockPlacemarks.results.filter(item => item.map === floorID);
  }

  async fetchFloorsByLocation() {
    await this._sleep();
    return mockMaps.results;
  }

  async fetchSVG() {
    await this._sleep();
    const blob = new Blob([mockSvg], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
  }

  openStream({
    locationID,
    floorID,
    onInitialTags,
    // onTagLeave,
    onTagUpdate
    // onException,
    // onClose
  }) {
    let interval;
    const originalPositions = new Map();
    const fn = async () => {
      const tags = await this.fetchTagsByFloor(locationID, floorID);
      for (const { x, y, mac } of tags) {
        originalPositions.set(mac, { x, y });
      }
      onInitialTags(tags);
      if (this._live) {
        // Simulate a tiny amount of jitter around the actual (x, y) position
        interval = setInterval(() => {
          const tag = tags[rand(0, tags.length - 1)];
          const dx = rand(-1, 1) * 100;
          const dy = rand(-1, 1) * 100;
          const { x, y } = originalPositions.get(tag.mac);
          tag.x = x + dx;
          tag.y = y + dy;
          onTagUpdate(tag);
        }, this._updateInterval);
      }
    };
    fn();
    return {
      close() {
        clearInterval(interval);
      }
    };
  }
}

function rand(a, b) {
  const c = b - a;
  return a + Math.floor(c * Math.random());
}

export const fakeAPI = missingPropertyProxy("API", new FakeAPI());
