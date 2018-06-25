import { h, Component } from "preact";
import PropTypes from "prop-types";

import MapMarker from "./MapMarker";

export default class PlacemarkLayer extends Component {
  static defaultProps = {
    markers: {},
    onUpdate: () => {},
    onFound: () => {}
  };

  static propTypes = {
    mapZoomFactor: PropTypes.number.isRequired,
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    api: PropTypes.object,
    markers: PropTypes.shape({
      all: PropTypes.bool,
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
    const { locationID, floorID, api } = this.props;
    const placemarksURL = `locations/${locationID}/maps/${floorID}/placemarks`;
    const { data } = await api.axios.get(placemarksURL);
    // TODO: This data is paginated... do we want to fetch _all_ of it?
    const placemarksByID = this.groupPlacemarksByID(data.results);
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
    const { placemarksByID } = this.state;
    const { markers, onMarkerClick, mapZoomFactor } = this.props;
    const filter = this.getFilterFunction();
    const filteredMarkers = Object.keys(placemarksByID)
      .map(id => placemarksByID[id])
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
