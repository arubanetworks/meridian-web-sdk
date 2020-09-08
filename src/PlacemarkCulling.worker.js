import { quadtree } from "d3-quadtree";
import debounce from "lodash.debounce";
// I wanted to make this file with TypeScript, but it the global variables are
// getting messed up because it thinks this file is a regular TypeScript file
// rather than a worker file...

function makeTree(placemarks) {
  return quadtree()
    .x(p => p.x)
    .y(p => p.y)
    .addAll(placemarks);
}

const state = {
  placemarks: [],
  tree: makeTree([]),
  culled: new Set(),
  mapBounds: [0, 0, 0, 0]
};

function setPlacemarks(placemarks) {
  state.placemarks = placemarks;
  state.tree = makeTree(placemarks);
}

function setMapBounds(mapBounds) {
  state.mapBounds = mapBounds;
}

const hideOnMap = Symbol("PlacemarkCullingWorker.hideOnMap");

function treeSearch(quadtree, xmin, ymin, xmax, ymax) {
  const results = [];
  quadtree.visit(function(node, x1, y1, x2, y2) {
    if (!node.length) {
      do {
        const { x, y } = node.data;
        if (x >= xmin && x < xmax && y >= ymin && y < ymax) {
          results.push(node.data);
        }
        node = node.next;
      } while (node);
    }
    return x1 >= xmax || y1 >= ymax || x2 < xmin || y2 < ymin;
  });
  return results;
}

function cull() {
  console.time("Placemark cull");
  // https://thoughtbot.com/blog/how-to-handle-large-amounts-of-data-on-maps
  // This quadtree has every placemark in it
  // This is the viewport bounds in world coordinates
  // Reset all placemarks to hidden
  for (const placemark of state.placemarks) {
    placemark[hideOnMap] = true;
  }
  // Destructure the map boundaries
  const [minX, minY, maxX, maxY] = state.mapBounds;
  // Break the screen up into 5x5 chunks
  const quadStep = 5;
  const stepX = (maxX - minX) / quadStep;
  const stepY = (maxY - minY) / quadStep;
  for (let x = minX; x < maxX; x += stepX) {
    for (let y = minY; y < maxY; y += stepY) {
      // Find all placemarks within the current rectangle
      const placemarks = treeSearch(state.tree, x, y, x + stepX, y + stepY);
      // Unhide the first placemark within this rectangle, if it exists
      for (const placemark of placemarks.slice(0, 1)) {
        placemark[hideOnMap] = false;
      }
    }
  }
  console.timeEnd("Placemark cull");
  state.culled = state.placemarks.filter(p => !p[hideOnMap]).map(p => p.id);
  postMessage({
    type: "setCulledPlacemarkIDs",
    culledPlacemarkIDs: new Set(state.culled)
  });
}

const debouncedCull = debounce(cull, 1000);

addEventListener("message", event => {
  switch (event.data.type) {
    case "setPlacemarks":
      setPlacemarks(event.data.placemarks);
      break;
    case "setMapBounds":
      setMapBounds(event.data.mapBounds);
      break;
    case "cull":
      debouncedCull();
      break;
    default:
      // eslint-disable-next-line no-console
      console.warn("PlacemarkCullingWorker: unknown message:", event.data);
      break;
  }
});
