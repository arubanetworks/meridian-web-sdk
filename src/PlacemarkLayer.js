/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { h, Component } from "preact";
import PropTypes from "prop-types";
// import throttle from "lodash.throttle";

import MapMarker from "./MapMarker";
import PlacemarkCullingWorker from "./PlacemarkCulling.worker";
// class PlacemarkCullingWorker {
//   postMessage() {}
// }

export const hideOnMap = Symbol("PlacemarkLayer.hideOnMap");

export default class PlacemarkLayer extends Component {
  static defaultProps = {
    markers: {},
    placemarks: {}
  };

  static propTypes = {
    mapBounds: PropTypes.array.isRequired,
    selectedItem: PropTypes.object,
    isPanningOrZooming: PropTypes.bool.isRequired,
    mapZoomFactor: PropTypes.number.isRequired,
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    youAreHerePlacemarkID: PropTypes.string,
    api: PropTypes.object,
    markers: PropTypes.shape({
      showHiddenPlacemarks: PropTypes.bool,
      filter: PropTypes.func,
      disabled: PropTypes.bool
    }),
    onMarkerClick: PropTypes.func,
    placemarks: PropTypes.object
  };

  constructor(props) {
    super(props);
    // TODO: Send placemarks to worker
    this.worker = new PlacemarkCullingWorker();
    this.worker.postMessage({ type: "hey" });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.placemarks !== this.props.placemarks) {
      // TODO: Send placemarks to worker
    }
    this.justStoppedPanningOrZooming =
      prevProps.isPanningOrZooming !== this.props.isPanningOrZooming &&
      !this.props.isPanningOrZooming;
  }

  shouldComponentUpdate(nextProps) {
    const zoomChanged = nextProps.mapZoomFactor !== this.props.mapZoomFactor;
    // Don't re-render when panning only (no zoom change)
    if (this.props.isPanningOrZooming && !zoomChanged) {
      return false;
    }
    return true;
  }

  getFilterFunction() {
    const { markers } = this.props;
    const { filter = () => true } = markers;
    return filter;
  }

  // throttledCullMarkers = throttle(markers => {
  //   // const begin = performance.now();
  //   // https://thoughtbot.com/blog/how-to-handle-large-amounts-of-data-on-maps
  //   // This quadtree has every placemark in it
  //   const { tree } = this.state;
  //   // This is the viewport bounds in world coordinates
  //   const { mapBounds } = this.props;
  //   // Reset all placemarks to hidden
  //   for (const m of markers) {
  //     m[hideOnMap] = true;
  //   }
  //   // Destructure the map boundaries
  //   const [minX, minY, maxX, maxY] = mapBounds;
  //   // Break the screen up into 5x5 chunks
  //   const quadStep = 5;
  //   const stepX = (maxX - minX) / quadStep;
  //   const stepY = (maxY - minY) / quadStep;
  //   for (let x = minX; x < maxX; x += stepX) {
  //     for (let y = minY; y < maxY; y += stepY) {
  //       // Find all placemarks within the current rectangle
  //       const search = quadtreeSearch(tree, x, y, x + stepX, y + stepY);
  //       // Unhide the first placemark within this rectangle, if it exists
  //       for (const m of search.slice(0, 1)) {
  //         m[hideOnMap] = false;
  //       }
  //     }
  //   }
  //   // const end = performance.now();
  //   // console.log("%f  |  %d  |  %f ms", mapZoomFactor, i, end - begin);
  // });

  render() {
    const {
      markers,
      onMarkerClick,
      mapZoomFactor,
      selectedItem,
      youAreHerePlacemarkID,
      mapBounds
    } = this.props;
    Object.assign(window, { mapBounds });
    const filter = this.getFilterFunction();
    const filteredMarkers = Object.values(this.props.placemarks)
      .filter(placemark => {
        if (markers.showHiddenPlacemarks !== true) {
          return !placemark.hide_on_map;
        }
        return true;
      })
      .filter(filter);
    // this.throttledCullMarkers(filteredMarkers);
    const finalMarkers = filteredMarkers.map(placemark => (
      <MapMarker
        selectedItem={selectedItem}
        mapZoomFactor={mapZoomFactor}
        key={placemark.id}
        kind="placemark"
        data={placemark}
        onClick={onMarkerClick}
        disabled={markers.disabled}
        youAreHerePlacemarkID={youAreHerePlacemarkID}
      />
    ));
    return <div>{finalMarkers}</div>;
  }
}
