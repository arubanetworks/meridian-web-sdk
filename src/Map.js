import { h, Component } from "preact";
import PropTypes from "prop-types";
import * as d3 from "./d3";

import ZoomButtons from "./ZoomButtons";
import Overlay from "./Overlay";
import Tags from "./Tags";
import { css, theme, cx } from "./style";

const cssMapContainer = css({
  label: "map-container",
  position: "relative",
  border: "1px solid #ccc",
  borderRadius: 0,
  background: "#fafafa",
  color: "#000",
  fontFamily: theme.fontFamily
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
        console.log("onZoom!", d3.event.transform.toString());
        this.mapGSelection.attr("transform", d3.event.transform);
      };
      this.zoomD3 = d3.zoom().on("zoom", onZoom);
      d3.select(this.mapSVG).call(this.zoomD3);
    }
  }

  adoptedMapSVG = null;

  setMapSVGRef = el => {
    this.mapSVG = el;
  };

  setMapGRef = element => {
    this.mapG = element;
  };

  zoomIn = () => {
    this.mapGSelection.call(this.zoomD3.scaleBy, 1.5);
  };

  zoomOut = () => {
    this.mapGSelection.call(this.zoomD3.scaleBy, 0.5);
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
    if (this.adoptedMapSVG) {
      const { x, y } = tag;
      this.adoptedMapSVG.zoom(1, { x, y });
    }
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
        style={{ width: width, height: height }}
      >
        <Overlay
          onClose={this.onOverlayClose}
          data={selectedItem.data}
          kind={selectedItem.kind}
        />
        {this.renderZoomControls()}
        <svg
          ref={this.setMapSVGRef}
          className={cx(cssMapSVG, "meridian-map-svg")}
          onClick={this.onClick}
          viewBox="0 0 1700 2200"
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid meet"
        >
          <g ref={this.setMapGRef}>
            <image
              width="1700"
              height="2200"
              xlinkHref={svgURL}
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
          </g>
        </svg>
      </div>
    );
  }
}
