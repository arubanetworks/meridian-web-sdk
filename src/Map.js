import { h, Component } from "preact";
import PropTypes from "prop-types";
import svg from "svg.js";
import "svg.panzoom.js";

import ZoomButtons from "./ZoomButtons";
import Overlay from "./Overlay";
import Tags from "./Tags";
import { css, theme } from "./style";

const cssMapContainer = css({
  label: "map-container",
  lineHeight: 0,
  overflow: "hidden",
  position: "relative",
  border: "1px solid #ccc",
  borderRadius: 0,
  background: "#fafafa",
  color: "#000",
  fontFamily: theme.fontFamily
});

const cssMapSVG = css({
  label: "map-svg",
  height: "100%"
});

export default class Map extends Component {
  static propTypes = {
    zoom: PropTypes.bool,
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
  }

  adoptedMapSVG = null;

  setMapSVGRef = el => {
    this.mapSVG = el;
  };

  initMap() {
    // console.info("the map is like totally initialized and ready");
  }

  onClick = e => {
    const mapClicked =
      this.mapSVG.isEqualNode(e.target) || this.mapImage.isEqualNode(e.target);
    if (this.props.onMapClick && mapClicked) {
      this.props.onMapClick(e);
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
    if (this.props.zoom && this.mapSVG) {
      const map = svg.adopt(this.mapSVG);
      map.panZoom({ zoomMin: 0.25, zoomMax: 20 });
      this.adoptedMapSVG = map;
      return <ZoomButtons map={map} />;
    }
    return null;
  }

  render() {
    const { svgURL, selectedItem } = this.state;
    const { locationID, floorID, api, markers } = this.props;
    return (
      <div className={`${cssMapContainer} meridian-map-container`}>
        <Overlay
          onClose={this.onOverlayClose}
          data={selectedItem.data}
          kind={selectedItem.kind}
        />
        {this.renderZoomControls()}
        <svg
          ref={this.setMapSVGRef}
          className={`${cssMapSVG} meridian-map-svg`}
          onClick={this.onClick}
          viewBox="0 0 1700 2200"
        >
          <g>
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
