import { h, Component } from "preact";
import PropTypes from "prop-types";
import svg from "svg.js";
import "svg.panzoom.js";

import Button from "./Button";
import { css } from "./style";

const mapSvg = css({
  label: "map",
  position: "relative",
  border: "1px solid #ccc",
  background: "#fafafa",
  color: "#000",
  fontWeight: "bold"
});

const zoomControls = css({
  position: "absolute",
  top: 20,
  zIndex: 1,
  top: "right",
  right: 10,
  top: 10
});

export default class Map extends Component {
  static propTypes = {
    zoom: PropTypes.bool,
    locationId: PropTypes.string.isRequired,
    floorId: PropTypes.string.isRequired,
    api: PropTypes.object,
    // Either "all" or an array of IDs (all caps MAC address no colons)
    tags: PropTypes.oneOfType([
      PropTypes.oneOf(["all"]),
      PropTypes.arrayOf(PropTypes.string)
    ])
  };

  static defaultProps = {
    zoom: true
  };

  state = {
    tagsById: {},
    svgUrl: null,
    connectionStatus: "Not connected"
  };

  async componentDidMount() {
    const { locationId, floorId, api, tags } = this.props;
    const { data } = await api.floor.get(locationId, floorId);
    this.setState(
      {
        svgUrl: data.svg_url
      },
      () => {
        if (tags) {
          this.connectionOpen();
        }
        this.initPanZoom();
      }
    );
  }

  connectionOpen() {
    const { floorId, locationId, api, tags } = this.props;
    const connection = api.floor.listen({
      locationId: locationId,
      id: floorId,
      onUpdate: data => {
        const { mac } = data;
        if (tags === "all" || tags.includes(mac)) {
          const { name, image_url: imageUrl } = data.editor_data;
          const { x, y } = data.calculations.default.location;
          const tag = { name, imageUrl, mac, x, y };
          this.setState(prevState => ({
            connectionStatus: "Connected",
            tagsById: { ...prevState.tagsById, [mac]: tag }
          }));
        }
      },
      onClose: () => {
        this.setState({
          connection: null,
          connectionStatus: "Closed"
        });
      }
    });
    this.setState({ connection, connectionStatus: "Connected" });
  }

  connectionClose() {
    this.state.connection.close();
  }

  renderTags() {
    const { tagsById } = this.state;
    return Object.keys(tagsById).map(mac => {
      const t = tagsById[mac];
      const { x, y } = t;
      return (
        <use
          key={mac}
          className="tag"
          cursor="pointer"
          pointerEvents="bounding-box"
          fill="black"
          width="23"
          height="23"
          x={x}
          y={y}
          xlinkHref="/assets/tag.svg#tag"
        />
      );
    });
  }

  initPanZoom() {
    const map = svg.get("map");
    map.panZoom({ zoomMin: 0.25, zoomMax: 20 });
    // map.zoom(1, { x: 1396.6849688435675, y: 1591.5310946482457 });
  }

  renderZoomControls() {
    if (this.props.zoom) {
      return (
        <div className={zoomControls}>
          <button>_</button>
          <br />
          <button>+</button>
        </div>
      );
    }
  }

  renderConnectionToggle() {
    const { connection } = this.state;
    if (!connection) {
      return (
        <Button onClick={() => this.connectionOpen()}>
          Open Connection (refresh data)
        </Button>
      );
    } else {
      return (
        <Button onClick={() => this.connectionClose()}>Close Connection</Button>
      );
    }
  }

  render() {
    const { svgUrl, connectionStatus } = this.state;
    return (
      <div>
        <p>
          {this.renderConnectionToggle()}
          <span> Status: {connectionStatus}</span>
        </p>
        <div style={{ position: "relative" }}>
          {this.renderZoomControls()}
          <svg id="map" className={mapSvg} viewBox="0 0 1700 2200">
            <g id="svg_parent">
              <image
                id="svg_map_image"
                width="1700"
                height="2200"
                xlinkHref={svgUrl}
              />
              {this.renderTags()}
            </g>
          </svg>
        </div>
      </div>
    );
  }
}
