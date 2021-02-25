/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { Component, h } from "preact";
import { MapComponentProps } from "./MapComponent";
import Placemark from "./Placemark";
import { asyncClientCall } from "./util";
import { API, CreateMapOptions, PlacemarkData, TagData } from "./web-sdk";

export interface PlacemarkLayerProps {
  selectedItem?: TagData | PlacemarkData;
  isPanningOrZooming: boolean;
  mapZoomFactor: number;
  locationID: string;
  floorID: string;
  api: API;
  markers: CreateMapOptions["placemarks"];
  onPlacemarkClick: (placemark: PlacemarkData) => void;
  onUpdate: MapComponentProps["onPlacemarksUpdate"];
  placemarks: Record<string, PlacemarkData>;
}

export default class PlacemarkLayer extends Component<PlacemarkLayerProps> {
  shouldComponentUpdate(nextProps: PlacemarkLayerProps) {
    // Don't re-render when panning only (no zoom change)
    return !(
      this.props.isPanningOrZooming &&
      nextProps.mapZoomFactor === this.props.mapZoomFactor
    );
  }

  componentDidUpdate(prevProps: PlacemarkLayerProps) {
    const { markers, placemarks, onUpdate } = this.props;
    if (
      onUpdate &&
      (placemarks !== prevProps.placemarks || markers !== prevProps.markers)
    ) {
      asyncClientCall(onUpdate, {
        allPlacemarks: Object.values(placemarks),
        filteredPlacemarks: this.getFilteredPlacemarks()
      });
    }
  }

  getFilteredPlacemarks() {
    const { placemarks, markers } = this.props;
    const filter = markers?.filter ?? (() => true);
    const filteredMarkers = Object.keys(placemarks)
      .map(id => placemarks[id])
      .filter(placemark => {
        if (placemark.type === "exclusion_area") {
          // NOTE: Consider adding a new configuration setting called
          // `placemarks.showExclusionAreas` in the future if someone actually
          // wants to show exclusion areas for some reason.
          return false;
        }
        if (markers?.showHiddenPlacemarks !== true) {
          return !placemark.hide_on_map;
        }
        return true;
      })
      .filter(filter);
    return filteredMarkers;
  }

  render() {
    const {
      markers,
      onPlacemarkClick,
      mapZoomFactor,
      selectedItem
    } = this.props;
    const filteredPlacemarks = this.getFilteredPlacemarks();
    return (
      <div>
        {filteredPlacemarks.map(placemark => (
          <Placemark
            isSelected={selectedItem ? selectedItem.id === placemark.id : false}
            mapZoomFactor={mapZoomFactor}
            data={placemark}
            onClick={onPlacemarkClick}
            disabled={markers?.disabled}
          />
        ))}
      </div>
    );
  }
}
