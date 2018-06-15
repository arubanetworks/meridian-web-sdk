import { h, Component } from "preact";
import PropTypes from "prop-types";
import * as d3 from "d3";

import Watermark from "./Watermark";
import ZoomButtons from "./ZoomButtons";
import Overlay from "./Overlay";
import Tags from "./Tags";
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

const cssMapOuter = css({
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
        categories: PropTypes.arrayOf(PropTypes.string),
        ids: PropTypes.arrayOf(PropTypes.string)
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
    mapZoomFactor: 0.5,
    mapData: null,
    svgURL: null,
    tagsConnection: null,
    tagsStatus: "Connecting",
    selectedItem: {}
  };

  async componentDidMount() {
    const { locationID, floorID, api } = this.props;
    const url = `locations/${locationID}/maps/${floorID}`;
    const { data } = await api.axios.get(url);
    this.setState({ mapData: data }, () => {
      this.addZoomBehavior();
    });
  }

  addZoomBehavior() {
    if (this.props.zoom && this.mapInner && this.mapOuter) {
      this.mapInnerSelection = d3.select(this.mapInner);
      const onZoom = () => {
        const { k, x, y } = d3.zoomTransform(this.mapOuter);
        const t = `translate(${x}px, ${y}px) scale(${k})`;
        this.mapInnerSelection.style("transform", t);
        this.setState({ mapZoomFactor: k });
      };
      // TODO:
      // - Use `.filter(...)` to filter out mouse wheel events without a
      //   modifier key, depending on user settings
      const { mapData } = this.state;
      this.zoomD3 = d3
        .zoom()
        // TODO: We're gonna need to calculate reasonable extents here based on
        // the container size and the map size
        .scaleExtent([0.125, 14])
        // TODO: Why is the translateExtent not working right?
        .duration(ZOOM_DURATION)
        .on("zoom", onZoom);
      this.mapOuterSelection = d3.select(this.mapOuter);
      this.mapOuterSelection.call(this.zoomD3);
      this.mapOuterSelection.call(
        this.zoomD3.translateTo,
        mapData.width / 2,
        mapData.height / 2
      );
      const outerSize = this.getMapOuterSize();
      this.mapOuterSelection.call(
        this.zoomD3.scaleTo,
        // TODO: Figure out the appropriate scale level to show the "whole" map.
        // This is currently just a quick calculation that seems to work ok.
        (0.5 * outerSize.width) / mapData.width
      );
    }
  }

  mapInnerSelection = null;
  mapOuterSelection = null;
  mapOuter = null;
  mapInner = null;

  setMapOuterRef = el => {
    this.mapOuter = el;
  };

  setMapInnerRef = element => {
    this.mapInner = element;
  };

  getMapOuterSize() {
    return {
      width: this.mapOuter.clientWidth,
      height: this.mapOuter.clientHeight
    };
  }

  zoomToPoint = (x, y, k) => {
    const { width, height } = this.getMapOuterSize();
    // I'm so sorry, but it's really hard to center things, and also math
    const t = d3.zoomIdentity
      .translate(-k * x + width / 2, -k * y + height / 2)
      .scale(k);
    this.mapOuterSelection
      .transition()
      .duration(ZOOM_DURATION)
      .call(this.zoomD3.transform, t);
  };

  zoomBy = factor => {
    this.mapOuterSelection
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
      this.mapOuter.isEqualNode(event.target) ||
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
    const { mapData, selectedItem } = this.state;
    const { locationID, floorID, api, markers, width, height } = this.props;
    return (
      <div
        className={cx(cssMapContainer, "meridian-map-container")}
        style={{ width, height }}
      >
        <svg style={{ display: "none" }}>
          <def>
            <symbol id="meridian-tag-default">
              <path
                d="M18.09,7c-0.01,0-0.01,0-0.02,0c0,0-0.01,0-0.01,0C18.04,7,18.02,7,18,7C11.93,7,7,11.93,7,18s4.93,11,11,11
c6.06,0,11-4.93,11-11C29,11.97,24.11,7.05,18.09,7z M15.09,18c0,1.64,1.33,2.98,2.98,2.98c1.64,0,2.98-1.33,2.98-2.98
c0-1.29-0.83-2.38-1.97-2.79v-2.08c2.22,0.51,3.89,2.49,3.89,4.87c0,2.76-2.24,5-5,5c-2.76,0-5-2.24-5-5
c0-2.45,1.78-4.49,4.11-4.91v2.12C15.92,15.62,15.09,16.71,15.09,18z M18,27c-4.96,0-9-4.04-9-9c0-4.65,3.54-8.48,8.07-8.95v2.01
c-3.44,0.44-6.11,3.38-6.11,6.94c0,3.86,3.14,7,7,7c3.86,0,7-3.14,7-7c0-3.48-2.56-6.37-5.89-6.9V9.07C23.53,9.6,27,13.4,27,18
C27,22.96,22.96,27,18,27z"
              />
            </symbol>
          </def>
        </svg>
        <Overlay
          onClose={this.onOverlayClose}
          data={selectedItem.data}
          kind={selectedItem.kind}
        />
        <Watermark />
        {this.renderZoomControls()}
        <div
          ref={this.setMapOuterRef}
          className={cx(cssMapOuter, "meridian-map-background")}
          onClick={this.onClick}
          style={{ width, height }}
        >
          <div ref={this.setMapInnerRef} style={{ transformOrigin: "0 0 0" }}>
            <img
              src={mapData && mapData.svg_url}
              ref={el => {
                this.mapImage = el;
              }}
            />
            <Tags
              mapZoomFactor={this.state.mapZoomFactor}
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
