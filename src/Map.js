import { h, Component } from "preact";
import PropTypes from "prop-types";
import * as d3 from "d3";
import objectValues from "lodash.values";
import groupBy from "lodash.groupby";

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
import { css, cx } from "./style";
import { fetchAllPaginatedData, asyncClientCall } from "./util";

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
    api: PropTypes.object,
    showFloorsControl: PropTypes.bool,
    showTagsControl: PropTypes.bool,
    tags: PropTypes.shape({
      showControlTags: PropTypes.bool,
      all: PropTypes.bool,
      labels: PropTypes.arrayOf(PropTypes.string),
      ids: PropTypes.arrayOf(PropTypes.string),
      disabled: PropTypes.bool
    }),
    placemarks: PropTypes.shape({
      showHiddenPlacemarks: PropTypes.bool,
      all: PropTypes.bool,
      types: PropTypes.arrayOf(PropTypes.string),
      ids: PropTypes.arrayOf(PropTypes.string),
      disabled: PropTypes.bool
    }),
    onMarkerClick: PropTypes.func,
    onMapClick: PropTypes.func,
    onTagsUpdate: PropTypes.func,
    onFloorsUpdate: PropTypes.func
  };

  static defaultProps = {
    showTagsControl: false,
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
      showLoadingSpinner: false,
      isPanningOrZooming: false,
      mapTransform: "",
      mapZoomFactor: 0.5,
      floorsByBuilding: null,
      placemarksData: null,
      svgURL: null,
      tagsConnection: null,
      tagsStatus: "Connecting",
      selectedItem: null
    };
    this.mapSelection = null;
    this.mapRef = null;
  }

  componentDidMount() {
    this.initializeFloors();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.floorID !== this.props.floorID) {
      this.zoomToDefault();
    }
  }

  toggleTagListOverlay = ({ open }) => {
    this.setState({ isTagListOverlayOpen: open });
  };

  toggleFloorOverlay = ({ open }) => {
    this.setState({ isFloorOverlayOpen: open });
  };

  toggleErrorOverlay = ({ open }) => {
    this.setState({ isErrorOverlayOpen: open });
  };

  toggleLoadingSpinner = ({ show }) => {
    this.setState({ showLoadingSpinner: show });
  };

  toggleMapMarkerOverlay = ({ open, selectedItem = null }) => {
    this.setState({ isMapMarkerOverlayOpen: open, selectedItem: selectedItem });
  };

  selectFloorByID = floorID => {
    this.props.update({ floorID });
  };

  async getFloors() {
    const { locationID, api } = this.props;
    const mapURL = `locations/${locationID}/maps`;
    const results = await fetchAllPaginatedData(api, mapURL);
    return results;
  }

  // TODO: We might want to memoize this based on floorID eventually
  getMapData() {
    const { floorID } = this.props;
    const { floorsByBuilding } = this.state;
    for (const floors of objectValues(floorsByBuilding)) {
      for (const floor of floors) {
        if (floor.id === floorID) {
          return floor;
        }
      }
    }
    return null;
  }

  async initializeFloors() {
    const { onFloorsUpdate } = this.props;
    const floors = await this.getFloors();
    const floorsSortedByLevel = floors
      .slice()
      .sort((a, b) => a.level - b.level);
    const floorsByBuilding = groupBy(floorsSortedByLevel, "group_name");
    this.setState({ floorsByBuilding }, () => {
      if (!this.zoomD3) {
        this.addZoomBehavior();
      }
      this.zoomToDefault();
      asyncClientCall(onFloorsUpdate, floorsByBuilding);
    });
  }

  addZoomBehavior() {
    const { shouldMapPanZoom } = this.props;
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
        .filter(() => shouldMapPanZoom(d3.event))
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

  onMarkerClick = marker => {
    if (this.props.onMarkerClick) {
      // eslint-disable-next-line no-console
      console.warn("onMarkerClick() is experimental, please do not use it");
      setTimeout(() => {
        this.props.onMarkerClick(marker.data);
      }, 0);
    } else {
      this.toggleMapMarkerOverlay({ open: true, selectedItem: marker });
    }
  };

  getAllFloors() {
    const { floorsByBuilding } = this.state;
    return objectValues(floorsByBuilding).reduce((a, b) => [...a, ...b], []);
  }

  getFloorCount() {
    return this.getAllFloors().length;
  }

  shouldShowFloors() {
    return this.props.showFloorsControl && this.getFloorCount() > 1;
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
    const { isFloorOverlayOpen, floorsByBuilding } = this.state;
    if (isFloorOverlayOpen) {
      return (
        <FloorOverlay
          currentFloorID={floorID}
          floorsByBuilding={floorsByBuilding}
          toggleFloorOverlay={this.toggleFloorOverlay}
          selectFloorByID={this.selectFloorByID}
        />
      );
    }
    return null;
  }

  renderTagListOverlay() {
    const { locationID, floorID, api, update, tags } = this.props;
    const { isTagListOverlayOpen, floorsByBuilding } = this.state;
    if (isTagListOverlayOpen) {
      return (
        <TagListOverlay
          showControlTags={tags.showControlTags}
          floorsByBuilding={floorsByBuilding}
          tagOptions={tags}
          update={update}
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
    if (isMapMarkerOverlayOpen && selectedItem && selectedItem.data) {
      return (
        <MapMarkerOverlay
          toggleMapMarkerOverlay={this.toggleMapMarkerOverlay}
          data={selectedItem.data}
          kind={selectedItem.kind}
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
      return <ErrorOverlay toggleErrorOverlay={this.toggleErrorOverlay} />;
    }
    return null;
  }

  render() {
    const mapData = this.getMapData();
    const { mapTransform, mapZoomFactor, isPanningOrZooming } = this.state;
    const {
      showTagsControl,
      locationID,
      floorID,
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
          cssMapContainer,
          isIE && cssNoTouchZoom,
          "meridian-map-container"
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
          className={cx(cssMap, "meridian-map-background")}
          onClick={this.onClick}
          style={{ width, height }}
        >
          <div style={{ transform: mapTransform, transformOrigin: "0 0 0" }}>
            <img
              src={mapData && mapData.svg_url}
              ref={el => {
                this.mapImage = el;
              }}
            />
            <PlacemarkLayer
              isPanningOrZooming={isPanningOrZooming}
              mapZoomFactor={mapZoomFactor}
              locationID={locationID}
              floorID={floorID}
              api={api}
              markers={placemarks}
              onMarkerClick={this.onMarkerClick}
            />
            <TagLayer
              isPanningOrZooming={isPanningOrZooming}
              mapZoomFactor={mapZoomFactor}
              locationID={locationID}
              floorID={floorID}
              api={api}
              markers={tags}
              onMarkerClick={this.onMarkerClick}
              onUpdate={onTagsUpdate}
            />
          </div>
        </div>
      </div>
    );
  }
}
