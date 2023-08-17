/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { select as d3Select, Selection } from "d3-selection";
import "d3-transition";
import {
  zoom as d3Zoom,
  ZoomBehavior,
  zoomIdentity as d3ZoomIdentity,
  zoomTransform as d3ZoomTransform,
} from "d3-zoom";
import { Component, createRef, Fragment, h } from "preact";
import AnnotationLayer from "./AnnotationLayer";
import DetailsOverlay from "./DetailsOverlay";
import ErrorOverlay from "./ErrorOverlay";
import FloorAndSearchControls from "./FloorAndSearchControls";
import FloorLabel from "./FloorLabel";
import FloorOverlay from "./FloorOverlay";
import LoadingSpinner from "./LoadingSpinner";
import OverlayLayer from "./OverlayLayer";
import PlacemarkLayer from "./PlacemarkLayer";
import { css, cx } from "./style";
import TagLayer from "./TagLayer";
import AssetListOverlay from "./AssetListOverlay";
import { asyncClientCall, isEnvOptions, logError } from "./util";
import Watermark from "./Watermark";
import {
  API,
  CreateMapOptions,
  FloorData,
  PlacemarkData,
  TagData,
} from "./web-sdk";
import ZoomControls from "./ZoomControls";
import debounce from "lodash.debounce";

const ZOOM_FACTOR = 0.5;
const ZOOM_DURATION = 250;

interface Box {
  width: number;
  height: number;
}

export interface MapComponentProps extends CreateMapOptions {
  destroy: () => void;
  update: (options: Partial<CreateMapOptions>) => void;
  // This property is optional in `CreateMapOptions`, only because you can still
  // use `MeridianSDK.init`, so we override the optional aspect here since
  // realistically it's actually required.
  api: API;
}

export interface MapComponentState {
  mapImageURL?: string;
  isFloorOverlayOpen: boolean;
  isAssetListOverlayOpen: boolean;
  isMapMarkerOverlayOpen: boolean;
  isErrorOverlayOpen: boolean;
  isPanningOrZooming: boolean;
  loadingSources: Record<string, any>;
  errors: any[];
  mapTransform: string;
  mapZoomFactor: number;
  floors: FloorData[];
  allPlacemarkData: PlacemarkData[];
  svgURL?: string;
  tagsConnection: any;
  tagsStatus: string;
  selectedItem?: PlacemarkData | TagData;
  areTagsLoading: boolean;
  arePlacemarksLoading: boolean;
  allTagData: TagData[];
}

class MapComponent extends Component<MapComponentProps, MapComponentState> {
  static defaultProps = {
    loadTags: true,
    loadPlacemarks: true,
    showSearchControl: true,
    showFloorsControl: true,
    shouldMapPanZoom: () => true,
    width: "100%",
    height: "400px",
    placemarks: {},
    tags: {},
    overlays: [],
    annotations: [],
    onTagsUpdate: () => {},
    onFloorChange: () => {},
    onLoadStateChange: () => {},
    onFloorsUpdate: () => {},
  };

  state: MapComponentState = {
    mapImageURL: undefined,
    isFloorOverlayOpen: false,
    isAssetListOverlayOpen: false,
    isMapMarkerOverlayOpen: false,
    isErrorOverlayOpen: false,
    isPanningOrZooming: false,
    loadingSources: {},
    errors: [],
    mapTransform: "",
    mapZoomFactor: 0.5,
    floors: [],
    allPlacemarkData: [],
    svgURL: undefined,
    tagsConnection: undefined,
    tagsStatus: "Connecting",
    selectedItem: undefined,
    areTagsLoading: Boolean(
      this.props.showSearchControl && this.props.loadTags
    ),
    arePlacemarksLoading: Boolean(
      this.props.showSearchControl && this.props.loadPlacemarks
    ),
    allTagData: [],
  };

  isMounted = false;
  isLoaded = false;
  fetchAllTagsTimeout: any;
  fetchAllTagsInitialized = false;
  fetchAllPlacemarksTimeout: any;
  fetchAllPlacemarksInitialized = false;
  mapRef = createRef<HTMLDivElement>();
  mapContainerRef = createRef<HTMLDivElement>();
  mapImageref = createRef<HTMLImageElement>();
  intervalAutoDestroy: any;
  zoomD3?: ZoomBehavior<HTMLDivElement, unknown>;
  mapSelection?: Selection<HTMLDivElement, unknown, null, undefined>;
  mapContainerSize: Box | undefined;
  debouncedResizeFn = debounce(this.handleResize.bind(this), 250);

  componentDidMount() {
    this.validateFloorID();
    this.isMounted = true;
    const { api, locationID } = this.props;
    if (!isEnvOptions(api.environment)) {
      this.toggleErrorOverlay({
        open: true,
        message: `API error: "${api.environment}" is not a valid environment`,
      });
    } else if (!locationID) {
      this.toggleErrorOverlay({
        open: true,
        message: `createMap error: "options.locationID" is required`,
      });
    } else {
      this.loadData();
    }
    // It would be really nice if the custom element `disonnectedCallback()` had
    // some kind of regular DOM equivalent.
    //
    // Basically, with `MutationObserver` you can either watch for direct
    // children or ALL descendants of a node. But there's no way to *just* know
    // if a node in question has become disconnected from the DOM. So you'd
    // either have to listen to `document.body` and have a callback called on
    // every single DOM modification in the entire app.
    //
    // Or we can simply poll periodically to see if we're connected to the DOM.
    // I haven't done benchmarking, but my gut instinct says the polling method
    // is probably less resource intensive, and is certainly easier to write.
    this.intervalAutoDestroy = setInterval(() => {
      if (
        this.isMounted &&
        this.mapContainerRef.current &&
        !this.mapContainerRef.current.isConnected
      ) {
        this.props.destroy();
      }
    }, 1000);

    window.addEventListener("resize", this.debouncedResizeFn);
  }

  async loadData() {
    await this.initializeFloors();
  }

  componentDidUpdate(prevProps: MapComponentProps) {
    if (this.props.locationID !== prevProps.locationID) {
      this.toggleAssetListOverlay({ open: false });
      this.toggleErrorOverlay({ open: false });
      this.toggleDetailsOverlay({ open: false });
      this.toggleFloorOverlay({ open: false });
      this.zoomToDefault();
      this.freeMapImageURL();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ mapImageURL: undefined, allPlacemarkData: [] });
      this.loadData();
      return;
    } else if (
      this.props.loadTags &&
      this.props.showSearchControl &&
      !prevProps.showSearchControl
    ) {
      this.fetchAllTags({ forceUpdate: true });
    }
    if (prevProps.floorID !== this.props.floorID) {
      this.zoomToDefault();
      this.validateFloorID();
      this.freeMapImageURL();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ mapImageURL: undefined });
      this.fetchMapImageURL();
    } else if (
      this.props.loadPlacemarks &&
      this.props.showSearchControl &&
      !prevProps.showSearchControl
    ) {
      this.fetchAllPlacemarks({ forceUpdate: true });
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
    if (this.fetchAllTagsTimeout) {
      clearTimeout(this.fetchAllTagsTimeout);
    }
    if (this.fetchAllPlacemarksTimeout) {
      clearTimeout(this.fetchAllPlacemarksTimeout);
    }
    this.freeMapImageURL();
    clearInterval(this.intervalAutoDestroy);
    window.removeEventListener("resize", this.debouncedResizeFn);
  }

  handleResize() {
    const previousSize = this.mapContainerSize;
    const currentSize = this.getMapRefSize();
    const { width: pWidth, height: pHeight } = previousSize || {};
    const { width: cWidth, height: cHeight } = currentSize;

    if (pWidth !== cWidth || pHeight !== cHeight) {
      this.mapContainerSize = currentSize;
      this.zoomToDefault();
    }
  }

  freeMapImageURL() {
    if (this.state.mapImageURL) {
      URL.revokeObjectURL(this.state.mapImageURL);
    }
  }

  async fetchMapImageURL() {
    const { api, locationID, floorID } = this.props;
    const mapData = this.getMapData();
    if (!mapData) {
      return;
    }
    const url = await api.fetchSVG(mapData.svg_url);
    if (!this.isMounted) {
      return;
    }
    if (
      floorID === this.props.floorID &&
      locationID === this.props.locationID
    ) {
      this.setState({ mapImageURL: url });
    } else {
      URL.revokeObjectURL(url);
    }
  }

  onTagsInit = () => {
    if (this.props.showSearchControl && this.props.loadTags) {
      this.fetchAllTags();
    }
  };

  onPlacemarksInit = () => {
    if (this.props.showSearchControl && this.props.loadPlacemarks) {
      this.fetchAllPlacemarks();
    }
  };

  updateMap = (newOptions: Partial<CreateMapOptions>) => {
    const { update } = this.props;
    update(newOptions);
  };

  // Helpful message for SDK devs
  validateFloorID() {
    const { floorID } = this.props;
    if (!floorID) {
      this.toggleErrorOverlay({
        open: true,
        message: `createMap error: "options.floorID" is required`,
      });
    }
  }

  fetchAllTags(options = { forceUpdate: false }) {
    if (this.fetchAllTagsInitialized && !options.forceUpdate) {
      return;
    }

    const loop = async () => {
      this.fetchAllTagsInitialized = true;
      try {
        // Clear any existing timers so we don't have two running at once
        if (this.fetchAllTagsTimeout) {
          clearTimeout(this.fetchAllTagsTimeout);
        }
        const { api, locationID } = this.props;
        this.setState({ areTagsLoading: true });
        let allTagData = [];
        try {
          allTagData = await api.fetchTagsByLocation(locationID);
        } catch (err) {
          logError(
            "Failed to load tags; use `loadTags: false` if this location does not have the tags paid feature"
          );
          // Exit early so that we don't continue to fail fetching tags
          return;
        }
        if (!this.isMounted) {
          return;
        }
        if (locationID !== this.props.locationID || !this.props.loadTags) {
          return;
        }
        this.setState({ allTagData });
        this.fetchAllTagsTimeout = setTimeout(loop, 5 * 60 * 1000);
      } finally {
        this.setState({ areTagsLoading: false });
      }
    };
    if (this.props.loadTags) {
      loop();
    }
    // We're not using setInterval for this because we want to wait on the async
    // function to complete to avoid race conditions
  }

  toggleAssetListOverlay = ({ open }: { open: boolean }) => {
    if (!this.isMounted) {
      return;
    }
    this.setState({ isAssetListOverlayOpen: open });
  };

  toggleFloorOverlay = ({ open }: { open: boolean }) => {
    if (!this.isMounted) {
      return;
    }
    this.setState({ isFloorOverlayOpen: open });
  };

  toggleErrorOverlay = ({
    open,
    message = "Unknown",
  }: {
    open: boolean;
    message?: string;
  }) => {
    if (!this.isMounted) {
      return;
    }
    if (open) {
      this.setState((prevState) => ({
        errors: [...prevState.errors, message],
        isErrorOverlayOpen: true,
      }));
    } else {
      this.setState({ isErrorOverlayOpen: false, errors: [] });
    }
  };

  toggleLoadingSpinner = ({
    show,
    source = "unknown",
  }: {
    show: boolean;
    source?: string;
  }) => {
    if (!this.isMounted) {
      return;
    }
    this.setState((prevState) => ({
      loadingSources: {
        ...prevState.loadingSources,
        [source]: show,
      },
    }));
  };

  showLoadingSpinner() {
    const { loadingSources } = this.state;
    const isLoaded = Object.keys(loadingSources).some((item) => {
      return loadingSources[item] === true;
    });
    if (this.props.onLoadStateChange && this.isLoaded !== isLoaded) {
      this.isLoaded = isLoaded;
      asyncClientCall(this.props.onLoadStateChange, isLoaded);
    }
    return isLoaded;
  }

  toggleDetailsOverlay = ({
    open,
    selectedItem,
  }: {
    open: boolean;
    selectedItem?: MapComponentState["selectedItem"];
  }) => {
    this.setState({ isMapMarkerOverlayOpen: open, selectedItem });
  };

  selectFloorByID = (floorID: string) => {
    this.updateMap({ floorID, annotations: [], overlays: [] });
    if (this.props.onFloorChange) {
      const floor = this.state.floors.find((f) => f.id === floorID);
      if (floor) {
        asyncClientCall(this.props.onFloorChange, floor);
      }
    }
  };

  fetchAllPlacemarks(options = { forceUpdate: false }) {
    if (this.fetchAllPlacemarksInitialized && !options.forceUpdate) {
      return;
    }
    const loop = async () => {
      this.fetchAllPlacemarksInitialized = true;
      try {
        // Clear any existing timers so we don't have two running at once
        if (this.fetchAllPlacemarksTimeout) {
          clearTimeout(this.fetchAllPlacemarksTimeout);
        }
        const { locationID, api } = this.props;
        let results: PlacemarkData[] = [];
        this.setState({ arePlacemarksLoading: true });
        try {
          if (this.props.loadPlacemarks) {
            results = await api.fetchPlacemarksByLocation(locationID);
          }
          if (!this.isMounted) {
            return;
          }
          this.setState({ allPlacemarkData: results });
        } catch (error) {
          logError("Failed to load placemark data");
          return;
        }
        this.fetchAllPlacemarksTimeout = setTimeout(loop, 10 * 60 * 1000);
      } finally {
        this.setState({ arePlacemarksLoading: false });
      }
    };
    if (this.props.loadPlacemarks) {
      loop();
    }
  }

  async getFloors() {
    const { locationID, api } = this.props;
    let results;
    try {
      results = await api.fetchFloorsByLocation(locationID);
      if (!this.isMounted) {
        return [];
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        this.toggleErrorOverlay({
          open: true,
          message: err.response.data.detail,
        });
      }
    }
    if (!results || !results.length) {
      this.toggleErrorOverlay({
        open: true,
        message: "Floor data could not be found.",
      });
    }
    return results;
  }

  getMapData() {
    const { floorID } = this.props;
    const { floors } = this.state;
    return floors.find((f) => f.id === floorID);
  }

  async initializeFloors() {
    this.toggleLoadingSpinner({ show: true, source: "map" });
    const { onFloorsUpdate = () => {}, locationID } = this.props;
    const floors = await this.getFloors();
    if (!this.isMounted) {
      return;
    }
    if (locationID !== this.props.locationID) {
      return;
    }
    if (floors && floors.length > 0) {
      this.setState({ floors }, () => {
        if (!this.zoomD3) {
          this.addZoomBehavior();
        }
        this.zoomToDefault();
        asyncClientCall(onFloorsUpdate, floors);
        this.fetchMapImageURL();
      });
    }
    this.toggleLoadingSpinner({ show: false, source: "map" });
  }

  addZoomBehavior() {
    if (this.mapRef.current) {
      const onZoom = () => {
        if (!this.mapRef.current) {
          return;
        }
        const { k, x, y } = d3ZoomTransform(this.mapRef.current);
        const t = `translate(${x}px, ${y}px) scale(${k})`;
        this.setState({
          mapTransform: t,
          mapZoomFactor: k,
          isPanningOrZooming: true,
        });
      };
      const onZoomEnd = () => {
        this.setState({ isPanningOrZooming: false });
      };
      this.zoomD3 = d3Zoom<HTMLDivElement, unknown>()
        // Don't destructure this at the top of the file because we need d3 to
        // hook until whatever the latest version of the function is, even if it
        // has changed since this callback was registered
        .filter((d3Event) =>
          this.props.shouldMapPanZoom
            ? this.props.shouldMapPanZoom(d3Event)
            : true
        )
        .duration(ZOOM_DURATION)
        .on("zoom", onZoom)
        .on("end.zoom", onZoomEnd);
      this.mapSelection = d3Select(this.mapRef.current);
      this.mapSelection.call(this.zoomD3);
    }
  }

  resetExtents() {
    this.zoomD3?.scaleExtent([0, Infinity]).translateExtent([
      [-Infinity, -Infinity],
      [+Infinity, +Infinity],
    ]);
  }

  setExtents(mapWidth: number, mapHeight: number) {
    const ZOOM_MAX = 8;
    const customMinZoomLevel = this.props.minZoomLevel;
    const customMaxZoomLevel = this.props.maxZoomLevel;

    if (this.mapRef.current) {
      const { k } = d3ZoomTransform(this.mapRef.current);
      const mapContainerSize = this.getMapRefSize();
      const PAD_X = mapContainerSize.width / k / 1.5;
      const PAD_Y = mapContainerSize.height / k / 1.5;

      const minZoom =
        customMinZoomLevel && typeof customMinZoomLevel === "number"
          ? customMinZoomLevel
          : k;
      const maxZoom =
        customMaxZoomLevel && typeof customMaxZoomLevel === "number"
          ? customMaxZoomLevel
          : ZOOM_MAX;

      this.zoomD3?.scaleExtent([minZoom, maxZoom]).translateExtent([
        [-PAD_X, -PAD_Y],
        [mapWidth + PAD_X, mapHeight + PAD_Y],
      ]);
    }
  }

  zoomToDefault() {
    const mapData = this.getMapData();
    const mapContainerSize = this.getMapRefSize();
    const mapWidth = mapData?.width;
    const mapHeight = mapData?.height;
    this.mapContainerSize = mapContainerSize;

    if (mapWidth && mapHeight && this.mapSelection && this.zoomD3) {
      this.resetExtents();
      this.mapSelection.call(
        this.zoomD3.translateTo,
        mapWidth / 2,
        mapHeight / 2
      );
      this.mapSelection.call(
        this.zoomD3.scaleTo,
        Math.min(
          (0.7 * mapContainerSize.width) / mapWidth,
          (0.7 * mapContainerSize.height) / mapHeight
        )
      );
      this.setExtents(mapWidth, mapHeight);
    }
  }

  getMapRefSize() {
    if (!this.mapRef.current) {
      throw new Error("mapRef is not defined");
    }
    return {
      width: this.mapRef.current.clientWidth,
      height: this.mapRef.current.clientHeight,
    };
  }

  centerMap() {
    const mapData = this.getMapData();
    const mapWidth = mapData?.width;
    const mapHeight = mapData?.height;

    if (mapWidth && mapHeight && this.mapSelection && this.zoomD3) {
      this.mapSelection.call(
        this.zoomD3.translateTo,
        mapWidth / 2,
        mapHeight / 2
      );
    }
  }

  zoomToPoint = (x: number, y: number, k: number) => {
    if (!this.mapSelection) {
      throw new Error("mapSelection is not defined");
    }
    if (!this.zoomD3) {
      throw new Error("zoomD3 is not defined");
    }
    const { width, height } = this.getMapRefSize();
    const t = d3ZoomIdentity
      .translate(-k * x + width / 2, -k * y + height / 2)
      .scale(k);
    this.mapSelection
      .transition()
      .duration(ZOOM_DURATION)
      .call(this.zoomD3.transform, t);
  };

  zoomBy = (factor: number) => {
    if (!this.mapSelection) {
      throw new Error("mapSelection is not defined");
    }
    if (!this.zoomD3) {
      throw new Error("zoomD3 is not defined");
    }
    this.mapSelection
      .transition()
      .duration(ZOOM_DURATION)
      .call(this.zoomD3.scaleBy, factor);
  };

  zoomIn = () => {
    this.zoomBy(1 + ZOOM_FACTOR);
  };

  zoomOut = () => {
    this.zoomBy(1 - ZOOM_FACTOR);
  };

  onClick = (event: Event) => {
    const mapClicked =
      event.target instanceof Element &&
      (this.mapRef.current?.isEqualNode?.(event.target) ||
        this.mapImageref.current?.isEqualNode(event.target));
    if (this.props.onMapClick && mapClicked) {
      asyncClientCall(this.props.onMapClick);
    } else if (mapClicked) {
      this.toggleDetailsOverlay({ open: false });
    }
  };

  onTagClick = async (tag: TagData) => {
    let showOverlay = true;
    const { onTagClick = () => {} } = this.props;
    try {
      const meridianEvent = {
        preventDefault: () => {
          showOverlay = false;
        },
      };
      await onTagClick(tag, meridianEvent);
    } catch (err) {
      logError(err);
    }
    if (showOverlay) {
      this.toggleDetailsOverlay({ open: true, selectedItem: tag });
    }
  };

  onPlacemarkClick = async (placemark: PlacemarkData) => {
    let showOverlay = true;
    const { onPlacemarkClick = () => {} } = this.props;
    try {
      const meridianEvent = {
        preventDefault: () => {
          showOverlay = false;
        },
      };
      await onPlacemarkClick(placemark, meridianEvent);
    } catch (err) {
      logError(err);
    }
    if (showOverlay) {
      this.toggleDetailsOverlay({ open: true, selectedItem: placemark });
    }
  };

  shouldShowFloors() {
    const { showFloorsControl = true } = this.props;
    const { floors } = this.state;
    return showFloorsControl && floors.length > 1;
  }

  renderFloorLabel() {
    const floor = this.getMapData();
    if (floor) {
      return (
        <FloorLabel buildingName={floor.group_name} floorName={floor.name} />
      );
    }
    return null;
  }

  renderFloorOverlay() {
    const { floorID, api } = this.props;
    const { isFloorOverlayOpen, floors } = this.state;
    if (isFloorOverlayOpen) {
      return (
        <FloorOverlay
          currentFloorID={floorID}
          floors={floors}
          toggleFloorOverlay={this.toggleFloorOverlay}
          selectFloorByID={this.selectFloorByID}
          language={api.language}
        />
      );
    }
    return null;
  }

  renderAssetListOverlay() {
    const {
      floorID,
      loadTags,
      loadPlacemarks,
      tags: tagOptions,
      placemarks: placemarkOptions,
      api,
    } = this.props;

    const {
      isAssetListOverlayOpen,
      floors,
      allTagData,
      areTagsLoading,
      arePlacemarksLoading,
      allPlacemarkData,
    } = this.state;

    if (isAssetListOverlayOpen && Boolean(loadPlacemarks || loadTags)) {
      return (
        <AssetListOverlay
          onTagClick={this.onTagClick}
          onPlacemarkClick={this.onPlacemarkClick}
          showControlTags={Boolean(tagOptions?.showControlTags ?? false)}
          floors={floors}
          tagsLoading={areTagsLoading}
          placemarksLoading={arePlacemarksLoading}
          tags={allTagData}
          tagOptions={tagOptions}
          placemarkOptions={placemarkOptions}
          updateMap={this.updateMap}
          currentFloorID={floorID}
          toggleAssetListOverlay={this.toggleAssetListOverlay}
          showTags={Boolean(loadTags)}
          showPlacemarks={Boolean(loadPlacemarks)}
          placemarks={allPlacemarkData}
          language={api.language}
        />
      );
    }
    return null;
  }

  renderDetailsOverlay() {
    const { isMapMarkerOverlayOpen, selectedItem } = this.state;
    if (isMapMarkerOverlayOpen && selectedItem) {
      return (
        <DetailsOverlay
          toggleDetailsOverlay={this.toggleDetailsOverlay}
          kind={"mac" in selectedItem ? "tag" : "placemark"}
          item={selectedItem}
        />
      );
    }
    return null;
  }

  renderLoadingSpinner() {
    if (this.showLoadingSpinner()) {
      return <LoadingSpinner />;
    }
    return null;
  }

  renderErrorOverlay() {
    if (this.state.isErrorOverlayOpen) {
      return (
        <ErrorOverlay
          toggleErrorOverlay={this.toggleErrorOverlay}
          messages={this.state.errors}
        />
      );
    }
    return null;
  }

  render() {
    const mapData = this.getMapData();
    const {
      mapImageURL,
      selectedItem,
      mapTransform,
      mapZoomFactor,
      isPanningOrZooming,
      errors,
    } = this.state;
    const {
      locationID,
      floorID,
      api,
      tags,
      placemarks,
      overlays = [],
      annotations = [],
      width = "",
      height = "",
      onTagsUpdate,
      onPlacemarksUpdate,
      showSearchControl,
      loadPlacemarks,
      loadTags,
    } = this.props;
    return (
      <div
        className={cx("meridian-map-container", cssMapContainer)}
        style={{ width, height }}
        data-testid="meridian--private--map-container"
        ref={(ref) => {
          this.mapContainerRef.current = ref;
        }}
      >
        <Watermark />
        <ZoomControls onZoomIn={this.zoomIn} onZoomOut={this.zoomOut} />
        {this.renderErrorOverlay()}
        {this.renderDetailsOverlay()}
        {this.renderFloorOverlay()}
        {this.renderAssetListOverlay()}
        {this.renderLoadingSpinner()}
        <FloorAndSearchControls
          showFloors={this.shouldShowFloors()}
          showSearch={Boolean(
            showSearchControl && (loadPlacemarks || loadTags)
          )}
          toggleFloorOverlay={this.toggleFloorOverlay}
          toggleAssetListOverlay={this.toggleAssetListOverlay}
        />
        {this.renderFloorLabel()}
        <div
          ref={(el) => {
            this.mapRef.current = el;
          }}
          className={cx("meridian-map-background", cssMap)}
          onClick={this.onClick}
          style={{ width, height }}
        >
          <div
            style={{
              position: "relative",
              width: 0,
              height: 0,
              transform: mapTransform,
              transformOrigin: "0 0 0",
            }}
          >
            <img src={mapImageURL} ref={this.mapImageref} />
            {errors.length === 0 && mapData ? (
              <Fragment>
                <OverlayLayer
                  mapZoomFactor={mapZoomFactor}
                  overlays={overlays}
                />
                {this.props.loadPlacemarks ? (
                  <PlacemarkLayer
                    selectedItem={selectedItem}
                    isPanningOrZooming={isPanningOrZooming}
                    mapZoomFactor={mapZoomFactor}
                    locationID={locationID}
                    floorID={floorID}
                    api={api}
                    placemarkOptions={placemarks}
                    onPlacemarkClick={this.onPlacemarkClick}
                    onUpdate={onPlacemarksUpdate}
                    toggleLoadingSpinner={this.toggleLoadingSpinner}
                    onInit={() => {
                      this.onPlacemarksInit();
                    }}
                  />
                ) : null}
                {this.props.loadTags ? (
                  <TagLayer
                    selectedItem={selectedItem}
                    isPanningOrZooming={isPanningOrZooming}
                    mapZoomFactor={mapZoomFactor}
                    locationID={locationID}
                    floorID={floorID}
                    api={api}
                    tagOptions={tags}
                    onTagClick={this.onTagClick}
                    onUpdate={onTagsUpdate}
                    toggleLoadingSpinner={this.toggleLoadingSpinner}
                    onInit={() => {
                      this.onTagsInit();
                    }}
                  />
                ) : null}
                <AnnotationLayer
                  mapZoomFactor={mapZoomFactor}
                  annotations={annotations}
                />
              </Fragment>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

const cssMapContainer = css({
  label: "map-container",
  display: "block",
  position: "relative",
  borderRadius: "inherit",
  background: "#fafafa",
  color: "#000",
  fontFamily: "inherit",
  textAlign: "left",
});

const cssMap = css({
  label: "map-outer",
  borderRadius: "inherit",
  display: "block",
  overflow: "hidden",
});

export default MapComponent;
