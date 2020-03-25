/** @jsx h */
import { h, Component } from "preact";
import PropTypes from "prop-types";
import * as d3 from "d3";

import Watermark from "./Watermark";
import ZoomControls from "./ZoomControls";
import FloorLabel from "./FloorLabel";
import FloorOverlay from "./FloorOverlay";
import TagListOverlay from "./TagListOverlay";
import MapMarkerOverlay from "./MapMarkerOverlay";
import LoadingSpinner from "./LoadingSpinner";
import ErrorOverlay from "./ErrorOverlay";
import TagLayer from "./TagLayer";
import PlacemarkLayer from "./PlacemarkLayer";
import FloorAndTagControls from "./FloorAndTagControls";
import { STREAM_ALL_FLOORS } from "./API";
import { css, cx } from "./style";
import {
  fetchAllPaginatedData,
  asyncClientCall,
  validateEnvironment,
  fetchAllTags,
  getDirections
} from "./util";
import { sendAnalyticsCodeEvent } from "./sdk";
import DirectionsLayer from "./DirectionsLayer";

const ZOOM_FACTOR = 0.5;
const ZOOM_DURATION = 250;
const isIE =
  window.navigator.userAgent.indexOf("MSIE ") !== -1 ||
  window.navigator.userAgent.indexOf("Trident/") !== -1 ||
  window.navigator.userAgent.indexOf("Edge/") !== -1;

const cssMapContainer = css({
  label: "map-container",
  display: "block",
  position: "relative",
  borderRadius: "inherit",
  background: "#fafafa",
  color: "#000",
  fontFamily: "inherit",
  textAlign: "left"
});

const cssMap = css({
  label: "map-outer",
  borderRadius: "inherit",
  display: "block",
  overflow: "hidden"
});

const cssNoTouchZoom = css({
  touchAction: "none"
});

export default class Map extends Component {
  static propTypes = {
    shouldMapPanZoom: PropTypes.func,
    update: PropTypes.func.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    youAreHerePlacemarkID: PropTypes.string,
    api: PropTypes.object,
    showFloorsControl: PropTypes.bool,
    showTagsControl: PropTypes.bool,
    tags: PropTypes.shape({
      showControlTags: PropTypes.bool,
      filter: PropTypes.func,
      disabled: PropTypes.bool
    }),
    placemarks: PropTypes.shape({
      showHiddenPlacemarks: PropTypes.bool,
      filter: PropTypes.func,
      disabled: PropTypes.bool
    }),
    onMarkerClick: PropTypes.func,
    onTagClick: PropTypes.func,
    onPlacemarkClick: PropTypes.func,
    onMapClick: PropTypes.func,
    onTagsUpdate: PropTypes.func,
    onFloorsUpdate: PropTypes.func
  };

  static defaultProps = {
    showTagsControl: true,
    showFloorsControl: true,
    shouldMapPanZoom: () => true,
    width: "100%",
    height: "400px",
    placemarks: {},
    tags: {},
    onTagsUpdate: () => {},
    onFloorsUpdate: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      isFloorOverlayOpen: false,
      isTagListOverlayOpen: false,
      isMapMarkerOverlayOpen: false,
      isErrorOverlayOpen: false,
      isPanningOrZooming: false,
      showLoadingSpinner: false,
      loadingSources: {},
      errors: [],
      mapTransform: "",
      mapZoomFactor: 0.5,
      floors: [],
      placemarks: {},
      svgURL: null,
      tagsConnection: null,
      tagsStatus: "Connecting",
      selectedItem: null,
      areTagsLoading: true,
      allTagData: [],
      routeSteps: []
    };
    this.tagsTimeout = null;
    this.mapSelection = null;
    this.mapRef = null;
    this.validateFloorID();
  }

  componentDidMount() {
    const { api, locationID } = this.props;
    const isEnvironmentValid = validateEnvironment(api.environment);
    if (!isEnvironmentValid) {
      this.toggleErrorOverlay({
        open: true,
        message: `API error: "${api.environment}" is not a valid environment`
      });
    } else if (!locationID) {
      this.toggleErrorOverlay({
        open: true,
        message: `createMap error: "options.locationID" is required`
      });
    } else {
      this.initializeFloors();
      this.updatePlacemarks();
      this.initializeTags();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.floorID !== this.props.floorID) {
      this.zoomToDefault();
      this.validateFloorID();
    }
    if (prevProps.youAreHerePlacemarkID !== this.props.youAreHerePlacemarkID) {
      this.setState({
        routeSteps: [],
        isMapMarkerOverlayOpen: false
      });
    }
  }

  componentWillUnmount() {
    if (this.tagsTimeout) {
      clearTimeout(this.tagsTimeout);
    }
  }

  updateMap = newOptions => {
    const { update } = this.props;
    update(newOptions);
  };

  // Helpful message for SDK devs
  validateFloorID() {
    const { floorID } = this.props;
    if (!floorID) {
      this.toggleErrorOverlay({
        open: true,
        message: `createMap error: "options.floorID" is required`
      });
    }
  }

  initializeTags() {
    // TODO: We should update this to not poll for updates unless the tab is
    // active. In that case it would also make sense to ask for an update when
    // they switch back. Might even make sense to block updates while the tag
    // list is open?
    const loop = async () => {
      const { api, locationID, tags } = this.props;
      const floorID = STREAM_ALL_FLOORS;
      const rawTags = await fetchAllTags({ api, locationID, floorID });
      const filteredTags = rawTags.filter(
        tag => tags.showControlTags === true || !tag.editor_data.is_control_tag
      );
      this.setState({
        areTagsLoading: false,
        allTagData: filteredTags
      });
      this.tagsTimeout = setTimeout(loop, 5 * 60 * 1000);
    };
    loop();
    // We're not using setInterval for this because we want to wait on the async
    // function to complete to avoid race conditions
  }

  toggleTagListOverlay = ({ open }) => {
    this.setState({ isTagListOverlayOpen: open });
  };

  toggleFloorOverlay = ({ open }) => {
    this.setState({ isFloorOverlayOpen: open });
  };

  toggleErrorOverlay = ({ open, message = "Unknown" }) => {
    if (open) {
      this.setState(prevState => ({
        errors: [...prevState.errors, message],
        isErrorOverlayOpen: true
      }));
    } else {
      this.setState({ isErrorOverlayOpen: false, errors: [] });
    }
  };

  toggleLoadingSpinner = ({ show, source = "unknown" }) => {
    const { showLoadingSpinner } = this.state;
    this.setState(
      prevState => ({
        loadingSources: { ...prevState.loadingSources, [source]: show }
      }),
      () => {
        if (show && !showLoadingSpinner) {
          this.setState({ showLoadingSpinner: show });
        } else if (!show) {
          const { loadingSources } = this.state;
          const isSourceLoading = Object.keys(loadingSources).some(item => {
            return loadingSources[item] === true;
          });
          if (!isSourceLoading) {
            this.setState({ showLoadingSpinner: false });
          }
        }
      }
    );
  };

  toggleMapMarkerOverlay = ({ open, selectedItem = null }) => {
    this.setState({ isMapMarkerOverlayOpen: open, selectedItem: selectedItem });
  };

  selectFloorByID = floorID => {
    this.updateMap({ floorID, routeSteps: [] });
  };

  groupPlacemarksByID = tags => {
    return tags
      .map(placemark => this.normalizePlacemark(placemark))
      .reduce((obj, placemark) => {
        obj[placemark.id] = placemark;
        return obj;
      }, {});
  };

  normalizePlacemark(placemark) {
    // TODO: Strip off excess data, maybe?
    return {
      kind: "placemark",
      ...placemark
    };
  }

  updatePlacemarks = async () => {
    const { locationID, floorID, api } = this.props;
    this.toggleLoadingSpinner({ show: true, source: "placemarks" });
    // 2018/08/21 - found a bug with the quadtree endpoint below, will revert when that's fixed
    // const placemarksURL = `locations/${locationID}/maps/${floorID}/placemarks`;
    const placemarksURL = `locations/${locationID}/placemarks?map=${floorID}`;
    const results = await fetchAllPaginatedData(api, placemarksURL);
    const placemarks = this.groupPlacemarksByID(results);
    this.setState({ placemarks }, () => {
      this.toggleLoadingSpinner({ show: false, source: "placemarks" });
    });
  };

  async getFloors() {
    const { locationID, api } = this.props;
    const mapURL = `locations/${locationID}/maps`;
    let results;
    try {
      results = await fetchAllPaginatedData(api, mapURL);
    } catch (e) {
      // TODO: compare with other error objects, similar?
      if (e.response && e.response.data && e.response.data.detail) {
        this.toggleErrorOverlay({
          open: true,
          message: e.response.data.detail
        });
      }
    }
    if (!results || !results.length) {
      this.toggleErrorOverlay({
        open: true,
        message: "Floor data could not be found."
      });
    }
    return results;
  }

  // TODO: We might want to memoize this based on floorID eventually
  getMapData() {
    const { floorID } = this.props;
    const { floors } = this.state;
    for (const floor of floors) {
      if (floor.id === floorID) {
        return floor;
      }
    }
    return null;
  }

  async initializeFloors() {
    this.toggleLoadingSpinner({ show: true, source: "map" });
    const { onFloorsUpdate } = this.props;
    const floors = await this.getFloors();
    if (floors && floors.length > 0) {
      this.setState({ floors }, () => {
        if (!this.zoomD3) {
          this.addZoomBehavior();
        }
        this.zoomToDefault();
        asyncClientCall(onFloorsUpdate, floors);
      });
    }
    this.toggleLoadingSpinner({ show: false, source: "map" });
  }

  addZoomBehavior() {
    if (this.mapRef) {
      const onZoom = () => {
        const { k, x, y } = d3.zoomTransform(this.mapRef);
        const t = `translate(${x}px, ${y}px) scale(${k})`;
        this.setState({
          mapTransform: t,
          mapZoomFactor: k,
          isPanningOrZooming: true
        });
      };
      const onZoomEnd = () => {
        this.setState({ isPanningOrZooming: false });
      };
      this.zoomD3 = d3
        .zoom()
        // Don't destructure this at the top of the file because we need d3 to
        // hook until whatever the latest version of the function is, even if it
        // has changed since this callback was registered
        .filter(() => this.props.shouldMapPanZoom(d3.event))
        // TODO: We're gonna need to calculate reasonable extents here based on
        // the container size and the map size
        .scaleExtent([1 / 16, 14])
        // TODO: Why is the translateExtent not working right?
        .duration(ZOOM_DURATION)
        .on("zoom", onZoom)
        .on("end.zoom", onZoomEnd);
      this.mapSelection = d3.select(this.mapRef);
      this.mapSelection.call(this.zoomD3);
    }
  }

  zoomToDefault() {
    const mapData = this.getMapData();
    const mapSize = this.getMapRefSize();
    if (mapData) {
      this.mapSelection.call(
        this.zoomD3.translateTo,
        mapData.width / 2,
        mapData.height / 2
      );
      this.mapSelection.call(
        this.zoomD3.scaleTo,
        // TODO: Figure out the appropriate scale level to show the "whole" map.
        // This is currently just a quick calculation that seems to work ok.
        (0.5 * mapSize.width) / mapData.width
      );
    }
  }

  getMapRefSize() {
    return {
      width: this.mapRef.clientWidth,
      height: this.mapRef.clientHeight
    };
  }

  zoomToPoint = (x, y, k) => {
    const { width, height } = this.getMapRefSize();
    // I'm so sorry, but it's really hard to center things, and also math
    const t = d3.zoomIdentity
      .translate(-k * x + width / 2, -k * y + height / 2)
      .scale(k);
    this.mapSelection
      .transition()
      .duration(ZOOM_DURATION)
      .call(this.zoomD3.transform, t);
  };

  zoomBy = factor => {
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

  onClick = event => {
    const mapClicked =
      this.mapRef.isEqualNode(event.target) ||
      this.mapImage.isEqualNode(event.target);
    if (this.props.onMapClick && mapClicked) {
      // eslint-disable-next-line no-console
      console.warn("onMapClick() is experimental, please do not use it");
      setTimeout(() => {
        this.props.onMapClick(event);
      }, 0);
    } else {
      if (mapClicked) {
        this.toggleMapMarkerOverlay({ open: false });
      }
    }
  };

  onMarkerClick = async data => {
    let showOverlay = true;
    const { onTagClick, onPlacemarkClick, onMarkerClick } = this.props;

    let callback = data.event_type ? onTagClick : onPlacemarkClick;

    const clientCallback = async () => {
      if (callback) {
        try {
          await callback(data, { preventDefault });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }
      if (onMarkerClick) {
        // eslint-disable-next-line no-console
        console.warn("onMarkerClick() is experimental, please do not use it");
        try {
          await onMarkerClick(data, { preventDefault });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }
    };

    const preventDefault = () => {
      showOverlay = false;
    };

    await clientCallback();
    if (showOverlay) {
      this.toggleMapMarkerOverlay({ open: true, selectedItem: data });
    }
  };

  onDirectionsToHereClicked = async item => {
    sendAnalyticsCodeEvent({
      action: "map.directions",
      locationID: this.props.locationID,
      youAreHerePlacemarkID: this.props.youAreHerePlacemarkID,
      destinationID: item.id
    });
    const response = await getDirections({
      api: this.props.api,
      locationID: this.props.locationID,
      fromMapID: this.props.floorID,
      fromPlacemarkID: this.props.youAreHerePlacemarkID,
      toPlacemarkID: item.id
    });
    if (response && response.data) {
      const routeSteps = response.data.routes[0].steps.map(step => step.points);
      this.setState({
        routeSteps,
        isMapMarkerOverlayOpen: false
      });
    }
  };

  shouldShowFloors() {
    const { showFloorsControl } = this.props;
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
    const { floorID } = this.props;
    const { isFloorOverlayOpen, floors } = this.state;
    if (isFloorOverlayOpen) {
      return (
        <FloorOverlay
          currentFloorID={floorID}
          floors={floors}
          toggleFloorOverlay={this.toggleFloorOverlay}
          selectFloorByID={this.selectFloorByID}
        />
      );
    }
    return null;
  }

  renderTagListOverlay() {
    const { locationID, floorID, api, tags } = this.props;
    const {
      isTagListOverlayOpen,
      floors,
      allTagData,
      areTagsLoading
    } = this.state;
    if (isTagListOverlayOpen) {
      return (
        <TagListOverlay
          onMarkerClick={this.onMarkerClick}
          showControlTags={tags.showControlTags}
          floors={floors}
          loading={areTagsLoading}
          tags={allTagData}
          tagOptions={tags}
          updateMap={this.updateMap}
          api={api}
          locationID={locationID}
          currentFloorID={floorID}
          toggleTagListOverlay={this.toggleTagListOverlay}
        />
      );
    }
    return null;
  }

  renderMapMarkerOverlay() {
    const { isMapMarkerOverlayOpen, selectedItem } = this.state;
    if (isMapMarkerOverlayOpen && selectedItem) {
      return (
        <MapMarkerOverlay
          toggleMapMarkerOverlay={this.toggleMapMarkerOverlay}
          kind={selectedItem.kind === "placemark" ? "placemark" : "tag"}
          item={selectedItem}
          youAreHerePlacemarkID={this.props.youAreHerePlacemarkID}
          onDirectionsToHereClicked={this.onDirectionsToHereClicked}
        />
      );
    }
    return null;
  }

  renderLoadingSpinner() {
    if (this.state.showLoadingSpinner) {
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
      selectedItem,
      mapTransform,
      mapZoomFactor,
      isPanningOrZooming,
      errors
    } = this.state;
    const {
      showTagsControl,
      locationID,
      floorID,
      youAreHerePlacemarkID,
      api,
      tags,
      placemarks,
      width,
      height,
      onTagsUpdate
    } = this.props;
    return (
      <div
        className={cx(
          "meridian-map-container",
          cssMapContainer,
          isIE && cssNoTouchZoom
        )}
        style={{ width, height }}
      >
        <Watermark />
        <ZoomControls onZoomIn={this.zoomIn} onZoomOut={this.zoomOut} />
        {this.renderLoadingSpinner()}
        {this.renderErrorOverlay()}
        {this.renderMapMarkerOverlay()}
        {this.renderFloorOverlay()}
        {this.renderTagListOverlay()}
        <FloorAndTagControls
          showFloors={this.shouldShowFloors()}
          showTagList={showTagsControl}
          toggleFloorOverlay={this.toggleFloorOverlay}
          toggleTagListOverlay={this.toggleTagListOverlay}
          toggleLoadingSpinner={this.toggleLoadingSpinner}
          toggleErrorOverlay={this.toggleErrorOverlay}
        />
        {this.renderFloorLabel()}
        <div
          ref={el => {
            this.mapRef = el;
          }}
          className={cx("meridian-map-background", cssMap)}
          onClick={this.onClick}
          style={{ width, height }}
        >
          <div
            style={{
              position: "relative",
              transform: mapTransform,
              transformOrigin: "0 0 0"
            }}
          >
            <img
              src={mapData && mapData.svg_url}
              ref={el => {
                this.mapImage = el;
              }}
            />
            {this.state.routeSteps.length > 0 && (
              <DirectionsLayer
                routeSteps={this.state.routeSteps}
                width={this.mapImage.clientWidth}
                height={this.mapImage.clientHeight}
              />
            )}
            {!errors.length && mapData ? (
              <PlacemarkLayer
                selectedItem={selectedItem}
                isPanningOrZooming={isPanningOrZooming}
                mapZoomFactor={mapZoomFactor}
                locationID={locationID}
                floorID={floorID}
                youAreHerePlacemarkID={youAreHerePlacemarkID}
                api={api}
                markers={placemarks}
                onMarkerClick={this.onMarkerClick}
                toggleLoadingSpinner={this.toggleLoadingSpinner}
                placemarks={this.state.placemarks}
                updatePlacemarks={this.updatePlacemarks}
              />
            ) : null}

            {!errors.length && mapData ? (
              <TagLayer
                selectedItem={selectedItem}
                isPanningOrZooming={isPanningOrZooming}
                mapZoomFactor={mapZoomFactor}
                locationID={locationID}
                floorID={floorID}
                api={api}
                markers={tags}
                onMarkerClick={this.onMarkerClick}
                onUpdate={onTagsUpdate}
                toggleLoadingSpinner={this.toggleLoadingSpinner}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
