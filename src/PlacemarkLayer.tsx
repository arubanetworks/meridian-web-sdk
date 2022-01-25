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
  placemarkOptions: CreateMapOptions["placemarks"];
  onPlacemarkClick: (placemark: PlacemarkData) => void;
  onUpdate: MapComponentProps["onPlacemarksUpdate"];
  toggleLoadingSpinner: (options: { show: boolean; source: string }) => void;
}

export interface PlacemarkLayerState {
  fetchedPlacemarks: PlacemarkData[];
}

export default class PlacemarkLayer extends Component<PlacemarkLayerProps> {
  state: PlacemarkLayerState = {
    fetchedPlacemarks: [],
  };

  isMounted = false;

  componentDidMount() {
    this.isMounted = true;
    this.fetchPlacemarks();
  }

  shouldComponentUpdate(nextProps: PlacemarkLayerProps) {
    // Don't re-render when panning only (no zoom change)
    return !(
      this.props.isPanningOrZooming &&
      nextProps.mapZoomFactor === this.props.mapZoomFactor
    );
  }

  async componentDidUpdate(prevProps: PlacemarkLayerProps) {
    const { placemarkOptions, onUpdate } = this.props;
    const floorChanged = prevProps.floorID !== this.props.floorID;

    if (floorChanged) {
      await this.fetchPlacemarks();
    }

    if (onUpdate && placemarkOptions !== prevProps.placemarkOptions) {
      const fetchedPlacemarks = this.state.fetchedPlacemarks;
      asyncClientCall(onUpdate, {
        allPlacemarks: fetchedPlacemarks as PlacemarkData[],
        filteredPlacemarks: this.getFilteredPlacemarks(fetchedPlacemarks),
      });
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  async fetchPlacemarks() {
    if (!this.isMounted) {
      return;
    }
    const { locationID, floorID, api, toggleLoadingSpinner } = this.props;
    toggleLoadingSpinner({ show: true, source: "placemarks" });
    const results: PlacemarkData[] = await api.fetchPlacemarksByFloor(
      locationID,
      floorID
    );
    const fetchedPlacemarks = results;
    this.setState({ fetchedPlacemarks }, () => {
      toggleLoadingSpinner({ show: false, source: "placemarks" });
    });
  }

  getFilteredPlacemarks(placemarks: any) {
    const { placemarkOptions, floorID } = this.props;
    const filter = placemarkOptions?.filter ?? (() => true);
    const filteredMarkers = placemarks
      .filter((placemark: PlacemarkData) => {
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
        if (placemarkOptions?.showHiddenPlacemarks !== true) {
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
        {placemarks.map((placemark: PlacemarkData) => (
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
            disabled={this.props.placemarkOptions?.disabled}
            labelMode={this.props.placemarkOptions?.labelMode ?? "zoom"}
            labelZoomLevel={this.props.placemarkOptions?.labelZoomLevel}
          />
        ))}
      </div>
    );
  }
}
