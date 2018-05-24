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
    locationId: PropTypes.string,
    floorId: PropTypes.string,
    api: PropTypes.object
  };

  static defaultProps = {
    zoom: true
  };

  state = {
    tags: {},
    svgUrl: null,
    connectionStatus: "Not connected"
  };

  async componentDidMount() {
    const { locationId, floorId, api } = this.props;
    const { data } = await api.floor.get(locationId, floorId);
    this.setState(
      {
        svgUrl: data.svg_url
      },
      () => {
        this.connectionOpen();
        this.initPanZoom();
      }
    );
  }

  connectionOpen() {
    const { floorId, locationId, api } = this.props;
    const connection = api.floor.listen({
      locationId: locationId,
      id: floorId,
      onUpdate: data => {
        const { mac } = data;
        const { x, y } = data.calculations.default.location;
        const tag = { mac, x, y };
        this.setState(prevState => ({
          connectionStatus: "Connected",
          tags: { ...prevState.tags, [mac]: tag }
        }));
      },
      onClose: () => {
        this.setState({
          connection: null,
          connectionStatus: "Closed"
        });
      }
    });
    this.setState({ connection, connectionStatus: "Connected" });
    setTimeout(() => {
      this.connectionClose();
    }, 60 * 1000);
  }

  connectionClose() {
    this.state.connection.close();
  }

  renderTags() {
    const { tags } = this.state;
    return Object.keys(tags).map(mac => {
      const t = tags[mac];
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
