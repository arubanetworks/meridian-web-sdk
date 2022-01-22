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
  toggleLoadingSpinner: (options: { show: boolean; source: string }) => void;
  groupPlacemarksByID: any;
}

export default class PlacemarkLayer extends Component<PlacemarkLayerProps> {
  state: any = {
    fetchedPlacemarks: [],
  };

  isMounted = false;

  componentDidMount() {
    this.fetchPlacemarks();
    this.isMounted = true;
  }

  shouldComponentUpdate(nextProps: PlacemarkLayerProps) {
    // Don't re-render when panning only (no zoom change)
    return !(
      this.props.isPanningOrZooming &&
      nextProps.mapZoomFactor === this.props.mapZoomFactor
    );
  }

  async componentDidUpdate(prevProps: PlacemarkLayerProps) {
    const { markers, onUpdate } = this.props;
    const floorChanged = prevProps.floorID !== this.props.floorID;

    if (floorChanged) {
      await this.fetchPlacemarks();
    }

    if (onUpdate && markers !== prevProps.markers) {
      const fetchedPlacemarks = this.state.fetchedPlacemarks;
      asyncClientCall(onUpdate, {
        allPlacemarks: Object.values(fetchedPlacemarks) as PlacemarkData[],
        filteredPlacemarks: this.getFilteredPlacemarks(fetchedPlacemarks),
      });
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  async fetchPlacemarks() {
    console.info("** fetching placemarks");
    const {
      locationID,
      floorID,
      api,
      toggleLoadingSpinner,
      groupPlacemarksByID,
    } = this.props;
    const results: PlacemarkData[] = await api.fetchPlacemarksByFloor(
      locationID,
      floorID
    );
    toggleLoadingSpinner({ show: true, source: "placemarks" });
    if (!this.isMounted) {
      return;
    }
    const fetchedPlacemarks = groupPlacemarksByID(results);
    this.setState({ fetchedPlacemarks }, () => {
      toggleLoadingSpinner({ show: false, source: "placemarks" });
    });
  }

  getFilteredPlacemarks(placemarks: any) {
    const { markers, floorID } = this.props;
    const filter = markers?.filter ?? (() => true);
    const filteredMarkers = Object.keys(placemarks)
      .map((id) => placemarks[id])
      .filter((placemark) => {
        // TODO: duplicate code, let's do this only once
        if (placemark.type === "exclusion_area") {
          // NOTE: Consider adding a new configuration setting called
          // `placemarks.showExclusionAreas` in the future if someone actually
          // wants to show exclusion areas for some reason.
          return false;
        }
        if (placemark.map !== floorID) {
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
    const placemarks = this.getFilteredPlacemarks(this.state.fetchedPlacemarks);
    return (
      <div data-testid="meridian--private--placemark-layer">
        {placemarks.map((placemark) => (
          <Placemark
            key={placemark.id}
            isSelected={
              this.props.selectedItem
                ? this.props.selectedItem.id === placemark.id
                : false
            }
            mapZoomFactor={this.props.mapZoomFactor}
            data={placemark}
            onClick={this.props.onPlacemarkClick}
            disabled={this.props.markers?.disabled}
            labelMode={this.props.markers?.labelMode ?? "zoom"}
            labelZoomLevel={this.props.markers?.labelZoomLevel}
          />
        ))}
      </div>
    );
  }
}
