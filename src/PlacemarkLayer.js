import { h, Component } from "preact";
import PropTypes from "prop-types";

import MapMarker from "./MapMarker";

export default class PlacemarkLayer extends Component {
  static defaultProps = {
    markers: null,
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
      ids: PropTypes.arrayOf(PropTypes.string)
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

  filterBy() {
    const { ids, types } = this.props.markers;
    if (ids && Array.isArray(ids) && ids.length) {
      return "ID";
    } else if (types && Array.isArray(types) && types.length) {
      return "TYPE";
    }
    return null;
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

  isMatch(placemark) {
    const { markers } = this.props;
    const filterBy = this.filterBy();
    if (filterBy === "ID") {
      return markers.ids.includes(placemark.id);
    } else if (filterBy === "TYPE") {
      return markers.types.includes(placemark.type);
    }
    return false;
  }

  render() {
    const { placemarksByID } = this.state;
    const { markers, onMarkerClick, mapZoomFactor } = this.props;
    const filteredMarkers = Object.keys(placemarksByID)
      .map(id => placemarksByID[id])
      .filter(placemark => markers.all || this.isMatch(placemark))
      .map(placemark => (
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
        />
      ));
    return <div>{filteredMarkers}</div>;
  }
}
