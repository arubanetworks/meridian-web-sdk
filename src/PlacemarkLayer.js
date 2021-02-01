/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { Component, h } from "preact";
import PropTypes from "prop-types";
import MapMarker from "./MapMarker";
import { asyncClientCall } from "./util";

export default class PlacemarkLayer extends Component {
  static defaultProps = {
    markers: {},
    placemarks: {},
    onUpdate: () => {}
  };

  static propTypes = {
    selectedItem: PropTypes.object,
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
    onUpdate: PropTypes.func,
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

  componentDidUpdate(prevProps) {
    const { markers, placemarks, onUpdate } = this.props;
    if (placemarks !== prevProps.placemarks || markers !== prevProps.markers) {
      asyncClientCall(onUpdate, {
        allPlacemarks: Object.values(placemarks),
        filteredPlacemarks: this.getVisibleMarkers(placemarks)
      });
    }
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

  getVisibleMarkers(markers) {
    const filter = this.getFilterFunction();
    const filteredMarkers = Object.keys(this.props.placemarks)
      .map(id => this.props.placemarks[id])
      .filter(placemark => {
        if (placemark.type === "exclusion_area") {
          // NOTE: Consider adding a new configuration setting called
          // `placemarks.showExclusionAreas` in the future if someone actually
          // wants to show exclusion areas for some reason.
          return false;
        }
        if (markers.showHiddenPlacemarks !== true) {
          return !placemark.hide_on_map;
        }
        return true;
      })
      .filter(filter);
    return this.cullMarkers(filteredMarkers);
  }

  render() {
    const { markers, onMarkerClick, mapZoomFactor, selectedItem } = this.props;
    const culledMarkers = this.getVisibleMarkers(markers);
    return (
      <div>
        {culledMarkers.map(placemark => (
          <MapMarker
            selectedItem={selectedItem}
            mapZoomFactor={mapZoomFactor}
            key={placemark.id}
            kind="placemark"
            data={placemark}
            onClick={onMarkerClick}
            disabled={markers.disabled}
          />
        ))}
      </div>
    );
  }
}
