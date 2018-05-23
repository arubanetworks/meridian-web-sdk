import { h, Component } from "preact";

import Button from "./Button";

export default class Map extends Component {
  state = {
    tags: {},
    svgUrl: null,
    connectionStatus: "Not connected"
  };

  async componentDidMount() {
    console.trace();
    const { locationId, floorId, api } = this.props;
    console.info("Component did load");
    const { data } = await api.floor.get(locationId, floorId);
    this.setState(
      {
        svgUrl: data.svg_url
      },
      () => {
        this.connectionOpen();
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
    this.setState({ connection });
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
          <svg class="map" viewBox="0 0 1700 2200">
            <g class="svg_parent">
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
