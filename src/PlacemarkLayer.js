/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { h, Component } from "preact";
import PropTypes from "prop-types";
import sortBy from "lodash.sortby";

import MapMarker from "./MapMarker";

export default class PlacemarkLayer extends Component {
  static defaultProps = {
    markers: {},
    placemarks: {}
  };

  static propTypes = {
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

  cullMarkers(markers) {
    const { mapZoomFactor } = this.props;
    // Step the zoom up into little chunks so we don't calculate a fully new
    // layout several times per second while zooming, which can cause UI flicker
    const step = 4;
    const approxZoom = Math.floor(mapZoomFactor * step) / step;
    const result = [];

    function isLabel(marker) {
      return marker.type.startsWith("label_");
    }

    // Rough check to see if two markers are a certain number of _screen pixels_
    // away from each other. Remember that the (x, y) values are in world
    // coordinates, not screen coordinates, so we have to multiply by the zoom
    // factor (approximate in this case).
    function collides(marker1, marker2) {
      const dx = marker1.x - marker2.x;
      const dy = marker1.y - marker2.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);
      return approxZoom * distance < 50;
    }

    // Prioritize label placemarks first, then just order things by their center
    // point since nothing else really makes sense.
    const sortedMarkers = sortBy(
      markers,
      m => (isLabel(m) ? -1 : 1),
      m => m.x,
      m => m.y
    );
    for (const m1 of sortedMarkers) {
      // Labels always show even if they overlap; then we check to make sure the
      // new placemark we're going to show collides with any other placemark
      // we've already decided to show.
      if (isLabel(m1) || !result.some(m2 => collides(m1, m2))) {
        result.push(m1);
      }
    }

    return result;
  }

  render() {
    const {
      markers,
      onMarkerClick,
      mapZoomFactor,
      selectedItem,
      youAreHerePlacemarkID
    } = this.props;
    const filter = this.getFilterFunction();
    const filteredMarkers = Object.keys(this.props.placemarks)
      .map(id => this.props.placemarks[id])
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
