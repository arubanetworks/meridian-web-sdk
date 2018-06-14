import { h, Component } from "preact";
import PropTypes from "prop-types";
import * as d3 from "d3";

import Watermark from "./Watermark";
import ZoomButtons from "./ZoomButtons";
import Overlay from "./Overlay";
import Tags from "./Tags";
import { css, theme, cx } from "./style";

const ZOOM_FACTOR = 0.5;
const ZOOM_DURATION = 200;

const cssMapContainer = css({
  label: "map-container",
  position: "relative",
  border: "1px solid #ccc",
  borderRadius: 0,
  background: "#fafafa",
  color: "#000",
  fontFamily: theme.fontFamily,
  textAlign: "left"
});

const cssMapSVG = css({
  label: "map-svg",
  borderRadius: "inherit",
  display: "block"
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
    height: "100%",
    markers: {}
  };

  state = {
    svgURL: null,
    tagsConnection: null,
    tagsStatus: "Connecting",
    selectedItem: {}
  };

  async componentDidMount() {
    const { locationID, floorID, api } = this.props;
    const url = `locations/${locationID}/maps/${floorID}`;
    const { data } = await api.axios.get(url);
    this.setState({ svgURL: data.svg_url });
    if (this.props.zoom && this.mapG && this.mapSVG) {
      this.mapGSelection = d3.select(this.mapG);
      const onZoom = () => {
        const { k, x, y } = d3.zoomTransform(this.mapSVG);
        const t = `translate(${x}px, ${y}px) scale(${k})`;
        this.mapGSelection.style("transform", t);
      };
      // TODO:
      // - Use `.filter(...)` to filter out mouse wheel events without a
      //   modifier key, depending on user settings
      // - Don't hard code this
      const width = this.mapSVG.clientWidth;
      const height = this.mapSVG.clientHeight;
      this.zoomD3 = d3
        .zoom()
        // TODO: Oops more hard coding!
        .extent([[0, 0], [width, height]])
        .scaleExtent([0.5, 16])
        // TODO: Why is the translateExtent not working right?
        // .translateExtent([[-width, -height], [width, height]])
        .on("zoom", onZoom);
      this.mapSVGSelection = d3.select(this.mapSVG);
      this.mapSVGSelection.call(this.zoomD3);
    }
  }

  mapGSelection = null;
  mapSVGSelection = null;

  setMapSVGRef = el => {
    this.mapSVG = el;
  };

  setMapGRef = element => {
    this.mapG = element;
  };

  zoomBy = factor => {
    this.mapSVGSelection
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
      this.mapSVG.isEqualNode(event.target) ||
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
    tag;
    // TODO
  };

  renderZoomControls() {
    if (this.props.zoom) {
      return <ZoomButtons onZoomIn={this.zoomIn} onZoomOut={this.zoomOut} />;
    }
    return null;
  }

  render() {
    const { svgURL, selectedItem } = this.state;
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
          ref={this.setMapSVGRef}
          className={cx(cssMapSVG, "meridian-map-svg")}
          onClick={this.onClick}
          width={width}
          height={height}
        >
          <div ref={this.setMapGRef}>
            <img
              width="1700"
              height="2200"
              src={svgURL}
              ref={el => {
                this.mapImage = el;
              }}
            />
            <Tags
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
