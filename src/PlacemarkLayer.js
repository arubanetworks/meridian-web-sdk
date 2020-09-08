/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { h, Component } from "preact";
import PropTypes from "prop-types";

import MapMarker from "./MapMarker";
import PlacemarkCullingWorker from "./PlacemarkCulling.worker";

export const hideOnMap = Symbol("PlacemarkLayer.hideOnMap");

export default class PlacemarkLayer extends Component {
  static defaultProps = {
    markers: {},
    placemarks: {},
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
      disabled: PropTypes.bool,
    }),
    onMarkerClick: PropTypes.func,
    placemarks: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      culledPlacemarkIDs: new Set(),
    };
    this.worker = new PlacemarkCullingWorker();
  }

  componentDidMount() {
    this.worker.addEventListener("message", this.handleWorkerMessage);
    this.worker.postMessage({
      type: "setPlacemarks",
      placemarks: Object.values(this.props.placemarks),
    });
  }

  componentWillUnmount() {
    this.worker.removeEventListener("message", this.handleWorkerMessage);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.placemarks !== this.props.placemarks) {
      this.worker.postMessage({
        type: "setPlacemarks",
        placemarks: Object.values(this.props.placemarks),
      });
      this.worker.postMessage({ type: "cull" });
    }
    if (String(prevProps.mapBounds) !== String(this.props.mapBounds)) {
      this.worker.postMessage({
        type: "setMapBounds",
        mapBounds: this.props.mapBounds,
      });
      this.worker.postMessage({ type: "cull" });
    }
  }

  handleWorkerMessage = (event) => {
    switch (event.data.type) {
      case "setCulledPlacemarkIDs":
        this.setState({ culledPlacemarkIDs: event.data.culledPlacemarkIDs });
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn("PlacemarkLayer: unexpected message:", event.data);
        break;
    }
  };

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

  render() {
    const {
      markers,
      onMarkerClick,
      mapZoomFactor,
      selectedItem,
      youAreHerePlacemarkID,
    } = this.props;
    const filter = this.getFilterFunction();
    const filteredMarkers = Object.values(this.props.placemarks)
      .filter((placemark) => {
        const isCulled = this.state.culledPlacemarkIDs.has(placemark.id);
        if (isCulled) {
          return false;
        }
        if (markers.showHiddenPlacemarks !== true) {
          return !placemark.hide_on_map;
        }
        return true;
      })
      .filter(filter);
    const finalMarkers = filteredMarkers.map((placemark) => (
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
