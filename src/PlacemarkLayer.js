import { h, Component } from "preact";
import PropTypes from "prop-types";

import MapMarker from "./MapMarker";
import { fetchAllPaginatedData } from "./util";

export default class PlacemarkLayer extends Component {
  static defaultProps = {
    markers: {}
  };

  static propTypes = {
    isPanningOrZooming: PropTypes.bool.isRequired,
    mapZoomFactor: PropTypes.number.isRequired,
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    api: PropTypes.object,
    markers: PropTypes.shape({
      showHiddenPlacemarks: PropTypes.bool,
      filter: PropTypes.func,
      disabled: PropTypes.bool
    }),
    onMarkerClick: PropTypes.func,
    toggleLoadingSpinner: PropTypes.func.isRequired
  };

  state = {
    placemarksByID: {}
  };

  async componentDidMount() {
    this.updatePlacemarks();
  }

  shouldComponentUpdate(nextProps) {
    const zoomChanged = nextProps.mapZoomFactor !== this.props.mapZoomFactor;
    // Don't re-render when panning only (no zoom change)
    if (this.props.isPanningOrZooming && !zoomChanged) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.floorID !== this.props.floorID) {
      this.setState({ placemarksByID: {} });
      this.updatePlacemarks();
    }
  }

  async updatePlacemarks() {
    const { locationID, floorID, api, toggleLoadingSpinner } = this.props;
    toggleLoadingSpinner({ show: true, source: "placemarks" });
    // 2018/08/21 - found a bug with the quadtree endpoint below, will revert when that's fixed
    // const placemarksURL = `locations/${locationID}/maps/${floorID}/placemarks`;
    const placemarksURL = `locations/${locationID}/placemarks?map=${floorID}`;
    const results = await fetchAllPaginatedData(api, placemarksURL);
    const placemarksByID = this.groupPlacemarksByID(results);
    this.setState({ placemarksByID }, () => {
      toggleLoadingSpinner({ show: false, source: "placemarks" });
    });
  }

  normalizePlacemark(placemark) {
    // TODO: Strip off excess data, maybe?
    return {
      kind: "placemark",
      ...placemark
    };
  }

  groupPlacemarksByID(tags) {
    return tags
      .map(placemark => this.normalizePlacemark(placemark))
      .reduce((obj, placemark) => {
        obj[placemark.id] = placemark;
        return obj;
      }, {});
  }

  getFilterFunction() {
    const { markers } = this.props;
    const { filter = () => true } = markers;
    return filter;
  }

  cullMarkers(markers) {
    // TODO: Perform culling based on collision detection of labels and also for
    // performance reasons
    return markers;
  }

  render() {
    const { placemarksByID } = this.state;
    const { markers, onMarkerClick, mapZoomFactor } = this.props;
    const filter = this.getFilterFunction();
    const filteredMarkers = Object.keys(placemarksByID)
      .map(id => placemarksByID[id])
      .filter(placemark => {
        if (markers.showHiddenPlacemarks !== true) {
          return !placemark.hide_on_map;
        }
        return true;
      })
      .filter(filter);
    const culledMarkers = this.cullMarkers(filteredMarkers);
    const finalMarkers = culledMarkers.map(placemark => (
      <MapMarker
        mapZoomFactor={mapZoomFactor}
        key={placemark.id}
        kind="placemark"
        id={placemark.id}
        x={placemark.x}
        y={placemark.y}
        name={placemark.name}
        data={placemark}
        onClick={onMarkerClick}
        disabled={markers.disabled}
      />
    ));
    return <div>{finalMarkers}</div>;
  }
}
