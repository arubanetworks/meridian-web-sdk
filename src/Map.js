import { h, Component } from "preact";
import PropTypes from "prop-types";
import svg from "svg.js";
import "svg.panzoom.js";

import Button from "./Button";
import ZoomButtons from "./ZoomButtons";
import Overlay from "./Overlay";
import Tags from "./Tags";
import { css } from "./style";

const cssMapContainer = css({
  label: "map-container",
  position: "relative",
  border: "1px solid #ccc",
  borderRadius: 3,
  background: "#fafafa",
  color: "#000"
});

const cssMapSvg = css({
  label: "map"
});

export default class Map extends Component {
  constructor(props) {
    super(props);

    this.setMapSvgRef = el => {
      this.mapSvg = el;
    };
    // reference to the SVG.js svg constructor (pan, zoom, etc)
    this.adoptedMapSvg = null;
  }

  static propTypes = {
    zoom: PropTypes.bool,
    locationId: PropTypes.string.isRequired,
    floorId: PropTypes.string.isRequired,
    api: PropTypes.object,
    show: PropTypes.shape({
      // Either "all" or an array of IDs (all caps MAC address no colons)
      tags: PropTypes.oneOfType([
        PropTypes.oneOf(["all"]),
        PropTypes.arrayOf(PropTypes.string)
      ])
    }),
    onMarkerClick: PropTypes.func,
    onMapClick: PropTypes.func
  };
  static defaultProps = {
    zoom: true,
    show: {}
  };
  state = {
    tagsById: {},
    svgUrl: null,
    tagsConnection: null,
    tagsStatus: "Connecting",
    selectedItem: {}
  };

  async componentDidMount() {
    const { locationId, floorId, api, show } = this.props;
    const { data } = await api.floor.get(locationId, floorId);
    this.setState({ svgUrl: data.svg_url });
  }

  initMap() {
    console.info("the map is like totally initialized and ready");
  }

  onClick(e) {
    const mapClicked =
      this.mapSvg.isEqualNode(e.target) || this.mapImage.isEqualNode(e.target);
    if (this.props.onMapClick && mapClicked) {
      this.props.onMapClick(e);
    } else {
      if (mapClicked) {
        this.setState({ selectedItem: {} });
      }
    }
  }

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
    if (this.adoptedMapSvg) {
      this.adoptedMapSvg.zoom(1, {
        x: tag.x,
        y: tag.y
      });
    }
  };

  renderZoomControls() {
    if (this.props.zoom && this.mapSvg) {
      const map = svg.adopt(this.mapSvg);
      map.panZoom({ zoomMin: 0.25, zoomMax: 20 });
      this.adoptedMapSvg = map;
      return <ZoomButtons map={map} />;
    }
  }

  renderTagsStatus() {
    if (this.props.show.tags) {
      return <span> Status: {this.state.tagsStatus} </span>;
    }
  }

  renderTagsConnection() {
    const { tagsConnection } = this.state;
    if (this.props.show.tags && tagsConnection) {
      return (
        <span>
          <Button onClick={() => tagsConnection.close()}>
            Close Connection
          </Button>
        </span>
      );
    }
  }

  render() {
    const { svgUrl, tagsStatus, selectedItem } = this.state;
    const { locationId, floorId, api, show } = this.props;

    return (
      <div class="meridian-component-container">
        <p>
          {this.renderTagsConnection()}
          {this.renderTagsStatus()}
        </p>
        <div className={`${cssMapContainer} meridian-map-container`}>
          <Overlay
            onClose={this.onOverlayClose}
            data={selectedItem.data}
            kind={selectedItem.kind}
          />
          {this.renderZoomControls()}
          <svg
            ref={this.setMapSvgRef}
            className={cssMapSvg}
            onClick={this.onClick.bind(this)}
            viewBox="0 0 1700 2200"
          >
            <g id="svg_parent">
              <image
                width="1700"
                height="2200"
                xlinkHref={svgUrl}
                ref={el => (this.mapImage = el)}
              />
              <Tags
                locationId={locationId}
                floorId={floorId}
                api={api}
                markers={show.tags}
                onMarkerClick={this.onMarkerClick}
                onUpdate={this.onTagsUpdate}
                onFound={this.onTagFound}
              />
            </g>
          </svg>
        </div>
      </div>
    );
  }
}
