import { h, Component } from "preact";
import Button from "./Button";
import { css } from "emotion";
import svg from "svg.js";
import panzoom from "svg.panzoom.js";

const className = css({
  label: "meridian-map",
  position: "relative",
  border: "1px solid #ccc",
  background: "#fafafa",
  color: "#000",
  fontWeight: "bold"
});

export default class Map extends Component {
  state = {
    tags: {},
    svgUrl: null,
    connectionStatus: "Not connected"
  };

  async componentDidMount() {
    const { locationId, floorId, api } = this.props;
    console.info("Component did load");
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
    const { tags } = this.state;
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
      onClose: data => {
        console.info("closing connection");
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
          className="tag"
          cursor="pointer"
          pointer-events="bounding-box"
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
    console.info("initalizing pan/zoom");
    const map = svg.get("map");
    console.info(map);
    map.panZoom({ zoomMin: 0.25, zoomMax: 20 });
    map.zoom(1, { x: 1396.6849688435675, y: 1591.5310946482457 });
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
        <div>
          <svg id="map" className={className} viewBox="0 0 1700 2200">
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
