import { h, Component } from "preact";
import PropTypes from "prop-types";
import * as d3 from "d3";

import Watermark from "./Watermark";
import ZoomButtons from "./ZoomButtons";
import Overlay from "./Overlay";
import TagLayer from "./TagLayer";
import PlacemarkLayer from "./PlacemarkLayer";
import { css, theme, cx } from "./style";

const ZOOM_FACTOR = 0.5;
const ZOOM_DURATION = 250;

const cssMapContainer = css({
  label: "map-container",
  display: "block",
  position: "relative",
  borderRadius: "inherit",
  background: "#fafafa",
  color: "#000",
  fontFamily: theme.fontFamily,
  textAlign: "left"
});

const cssMap = css({
  label: "map-outer",
  borderRadius: "inherit",
  display: "block",
  overflow: "hidden"
});

export default class Map extends Component {
  static propTypes = {
    zoom: PropTypes.bool,
    width: PropTypes.string,
    height: PropTypes.string,
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    api: PropTypes.object,
    markers: PropTypes.shape({
      tags: PropTypes.shape({
        all: PropTypes.bool,
        labels: PropTypes.arrayOf(PropTypes.string),
        ids: PropTypes.arrayOf(PropTypes.string),
        disabled: PropTypes.bool
      }),
      placemarks: PropTypes.shape({
        all: PropTypes.bool,
        types: PropTypes.arrayOf(PropTypes.string),
        ids: PropTypes.arrayOf(PropTypes.string),
        disabled: PropTypes.bool
      })
    }),
    onMarkerClick: PropTypes.func,
    onMapClick: PropTypes.func
  };

  static defaultProps = {
    zoom: true,
    width: "100%",
    height: "400px",
    markers: {}
  };

  state = {
    isPanningOrZooming: false,
    mapTransform: "",
    mapZoomFactor: 0.5,
    mapData: null,
    placemarksData: null,
    svgURL: null,
    tagsConnection: null,
    tagsStatus: "Connecting",
    selectedItem: {}
  };

  async componentDidMount() {
    const { locationID, floorID, api } = this.props;
    const mapURL = `locations/${locationID}/maps/${floorID}`;
    const { data } = await api.axios.get(mapURL);
    this.setState({ mapData: data }, () => {
      this.addZoomBehavior();
    });
  }

  addZoomBehavior() {
    if (this.props.zoom && this.mapRef) {
      const onZoom = () => {
        const { k, x, y } = d3.zoomTransform(this.mapRef);
        const t = `translate(${x}px, ${y}px) scale(${k})`;
        this.setState({ mapTransform: t, mapZoomFactor: k });
      };
      const onZoomStart = () => {
        this.setState({ isPanningOrZooming: true });
      };
      const onZoomEnd = () => {
        this.setState({ isPanningOrZooming: false });
      };
      // TODO:
      // - Use `.filter(...)` to filter out mouse wheel events without a
      //   modifier key, depending on user settings
      const { mapData } = this.state;
      const mapSize = this.getMapRefSize();
      this.zoomD3 = d3
        .zoom()
        // TODO: We're gonna need to calculate reasonable extents here based on
        // the container size and the map size
        .scaleExtent([1 / 16, 14])
        // TODO: Why is the translateExtent not working right?
        .duration(ZOOM_DURATION)
        .on("start.zoom", onZoomStart)
        .on("zoom", onZoom)
        .on("end.zoom", onZoomEnd);
      this.mapSelection = d3.select(this.mapRef);
      this.mapSelection.call(this.zoomD3);
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

  mapSelection = null;
  mapRef = null;

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
      this.props.onMapClick(event);
    } else {
      if (mapClicked) {
        this.setState({ selectedItem: {} });
      }
    }
  };

  onMarkerClick = ({ kind, data }) => {
    if (this.props.onMarkerClick) {
      this.props.onMarkerClick(data);
    } else {
      this.setState({ selectedItem: { kind, data } });
    }
  };

  onOverlayClose = () => {
    this.setState({ selectedItem: {} });
  };

  onTagsUpdate = (connection, status, tags) => {
    this.setState({
      tagsConnection: connection,
      tagsStatus: status,
      tagsFound: tags
    });
  };

  onTagFound = tag => {
    this.zoomToPoint(tag.x, tag.y, 2);
  };

  renderZoomControls() {
    if (this.props.zoom) {
      return <ZoomButtons onZoomIn={this.zoomIn} onZoomOut={this.zoomOut} />;
    }
    return null;
  }

  render() {
    const {
      mapData,
      selectedItem,
      mapTransform,
      mapZoomFactor,
      isPanningOrZooming
    } = this.state;
    const { locationID, floorID, api, markers, width, height } = this.props;
    return (
      <div
        className={cx(cssMapContainer, "meridian-map-container")}
        style={{ width, height }}
      >
        <Overlay
          onClose={this.onOverlayClose}
          data={selectedItem.data}
          kind={selectedItem.kind}
        />
        <Watermark />
        {this.renderZoomControls()}
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
              mapZoomFactor={mapZoomFactor}
              locationID={locationID}
              floorID={floorID}
              api={api}
              markers={markers.placemarks}
              onMarkerClick={this.onMarkerClick}
            />
            <TagLayer
              isPanningOrZooming={isPanningOrZooming}
              mapZoomFactor={mapZoomFactor}
              locationID={locationID}
              floorID={floorID}
              api={api}
              markers={markers.tags}
              onMarkerClick={this.onMarkerClick}
              onUpdate={this.onTagsUpdate}
              onFound={this.onTagFound}
            />
          </div>
        </div>
      </div>
    );
  }
}
