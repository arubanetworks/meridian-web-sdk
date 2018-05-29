import { h, Component } from "preact";
import PropTypes from "prop-types";
import svg from "svg.js";
import "svg.panzoom.js";

import Button from "./Button";
import ZoomButtons from "./ZoomButtons";
import Drawer from "./Drawer";
import Tag from "./Tag";
import { css } from "./style";

const cssMapSvg = css({
  label: "map",
  position: "relative",
  border: "1px solid #ccc",
  background: "#fafafa",
  color: "#000",
  fontWeight: "bold"
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
    connectionStatus: "Not connected",
    selectedItem: {},
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
        this.initMap();
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
  mapRef(ref) {
    if (ref) {
      this.map = ref;
    }
  }
  renderTags() {
    const { tagsById } = this.state;
    return Object.keys(tagsById).map(mac => {
      const t = tagsById[mac];
      const { x, y } = t;
      return (
        <Tag
          id={mac}
          x={x}
          y={y}
          onClick={() => this.setState({ selectedItem: t })}
        />
      );
    });
  }

  initMap() {
    console.info("the map is like totally initialized and ready");
  }
  onMapClick(e) {
    console.log("onMapClick", this.map, e.target, this.map.isEqualNode(e.target));
    if (this.map.isEqualNode(e.target)) {
      this.setState({ selectedItem: {} });
    }
  }
  renderZoomControls() {
    if (this.props.zoom && this.mapSvg) {
      const map = svg.adopt(this.mapSvg);
      map.panZoom({ zoomMin: 0.25, zoomMax: 20 });
      return <ZoomButtons map={map} />;
    }
  }

  renderConnectionToggle() {
    if (this.props.tags) {
      const { connection } = this.state;
      if (!connection) {
        return (
          <Button onClick={() => this.connectionOpen()}>
            Open Connection (refresh data)
          </Button>
        );
      } else {
        return (
          <Button onClick={() => this.connectionClose()}>
            Close Connection
          </Button>
        );
      }
    }
  }
  renderSelectedItem() {
    const { selectedItem } = this.state;
    if (Object.keys(selectedItem).length > 0) {
      return (
        <Drawer>{selectedItem.name}</Drawer>
      );
    }
    return null;
  }
  render() {
    const { svgUrl, connectionStatus } = this.state;
    return (
      <div>
        <p>
          {this.renderConnectionToggle()}
          <span> Status: {connectionStatus}</span>
        </p>
        {this.renderSelectedItem()}
        <div  style={{ position: "relative" }} >
          {this.renderZoomControls()}
          <svg
            ref={el => (this.mapSvg = el)}
            className={cssMapSvg}
            viewBox="0 0 1700 2200"
          >
            <g id="svg_parent">
              <image width="1700" height="2200" ref={this.mapRef.bind(this)} xlinkHref={svgUrl} onClick={this.onMapClick.bind(this)} />
              {this.renderTags()}
            </g>
          </svg>
        </div>
      </div>
    );
  }
}
