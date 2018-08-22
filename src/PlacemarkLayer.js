import { h, Component } from "preact";
import PropTypes from "prop-types";

import MapMarker from "./MapMarker";
import { fetchAllPaginatedData } from "./util";

export default class PlacemarkLayer extends Component {
  static defaultProps = {
    markers: {},
    onUpdate: () => {},
    onFound: () => {}
  };

  static propTypes = {
    isPanningOrZooming: PropTypes.bool.isRequired,
    mapZoomFactor: PropTypes.number.isRequired,
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    api: PropTypes.object,
    markers: PropTypes.shape({
      all: PropTypes.bool,
      showHiddenPlacemarks: PropTypes.bool,
      types: PropTypes.arrayOf(PropTypes.string),
      ids: PropTypes.arrayOf(PropTypes.string),
      disabled: PropTypes.bool
    }),
    onMarkerClick: PropTypes.func
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
    const { locationID, floorID, api } = this.props;
    // 2018/08/21 - found a bug with the quadtree endpoint below, will revert when that's fixed
    // const placemarksURL = `locations/${locationID}/maps/${floorID}/placemarks`;
    const placemarksURL = `locations/${locationID}/placemarks?map=${floorID}`;
    const results = await fetchAllPaginatedData(api, placemarksURL);
    const placemarksByID = this.groupPlacemarksByID(results);
    this.setState({ placemarksByID });
  }

  normalizePlacemark(placemark) {
    // TODO: Strip off excess data
    return placemark;
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
    const { ids, types, all } = this.props.markers;
    if (all) {
      return () => true;
    } else if (ids && Array.isArray(ids) && ids.length > 0) {
      return placemark => ids.includes(placemark.id);
    } else if (types && Array.isArray(types) && types.length > 0) {
      return placemark => types.includes(placemark.type);
    }
    return () => false;
  }

  cullMarkers(markers) {
    // TODO: Perform culling based on collision detection of labels and also for
    // performance reasons
    return markers;
  }

  render() {
    // console.info("Render > PlacemarkLayer", Math.floor(Date.now() / 1000));
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
