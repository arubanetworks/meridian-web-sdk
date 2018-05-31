import { h, Component } from "preact";
import PropTypes from "prop-types";
import svg from "svg.js";
import "svg.panzoom.js";

import Button from "./Button";
import ZoomButtons from "./ZoomButtons";
import Drawer from "./Drawer";
import MapMarker from "./MapMarker";
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
    show: PropTypes.shape({
      // Either "all" or an array of IDs (all caps MAC address no colons)
      tags: PropTypes.oneOfType([
        PropTypes.oneOf(["all"]),
        PropTypes.arrayOf(PropTypes.string)
      ])
    }),
    /** onMarkerClick */
    onMarkerClick: PropTypes.func,
    /** onMapClick */
    onMapClick: PropTypes.func,
  };
  static defaultProps = {
    zoom: true,
    show: {}
  };
  state = {
    tagsById: {},
    svgUrl: null,
    socketConnection: null,
    socketConnectionStatus: "Not connected",
    selectedItem: {}
  };

  async componentDidMount() {
    const { locationId, floorId, api, show } = this.props;
    const { data } = await api.floor.get(locationId, floorId);
    this.setState(
      {
        svgUrl: data.svg_url
      },
      () => {
        if (show.tags) {
          this.socketConnectionOpen();
        }
        this.initMap();
      }
    );
  }

  socketConnectionOpen() {
    const { floorId, locationId, api, show } = this.props;
    const socketConnection = api.floor.listen({
      locationId: locationId,
      id: floorId,
      onUpdate: data => {
        const { mac } = data;
        if (show.tags === "all" || show.tags.includes(mac)) {
          const { name, image_url: imageUrl } = data.editor_data;
          const { x, y } = data.calculations.default.location;
          const tag = { name, mac, x, y, data: data.editor_data };
          this.setState(prevState => ({
            socketConnectionStatus: "Connected",
            tagsById: { ...prevState.tagsById, [mac]: tag }
          }));
        }
      },
      onClose: () => {
        this.setState({
          socketConnection: null,
          socketConnectionStatus: "Closed"
        });
      }
    });
    this.setState({ socketConnection, socketConnectionStatus: "Connected" });
  }

  socketConnectionClose() {
    this.state.socketConnection.close();
  }

  renderTags() {
    const { tagsById } = this.state;
    return Object.keys(tagsById).map(mac => {
      const t = tagsById[mac];
      const { x, y, name, data } = t;
      return (
        <MapMarker
          kind="tag"
          mac={mac}
          x={x}
          y={y}
          name={name} // to show title on hover?
          data={data} // all of the server data
          onClick={() => {
            if (this.props.onMarkerClick) {
              this.props.onMarkerClick(data);
            } else {
              this.setState({ selectedItem: t });
            }
          }}
        />
      );
    });
  }

  initMap() {
    console.info("the map is like totally initialized and ready");
  }

  onMapClick(e) {
    const mapClicked = this.mapSvg.isEqualNode(e.target) || this.mapImage.isEqualNode(e.target);
    if (this.props.onMapClick && mapClicked) {
      this.props.onMapClick(e);
    } else {
      if (mapClicked) {
        this.setState({ selectedItem: {} });
      }
    }
  }

  renderZoomControls() {
    if (this.props.zoom && this.mapSvg) {
      const map = svg.adopt(this.mapSvg);
      map.panZoom({ zoomMin: 0.25, zoomMax: 20 });
      return <ZoomButtons map={map} />;
    }
  }

  renderSocketConnectionToggle() {
    if (this.props.show.tags) {
      const { socketConnection } = this.state;
      if (!socketConnection) {
        return (
          <Button onClick={() => this.socketConnectionOpen()}>
            Open Connection (refresh data)
          </Button>
        );
      } else {
        return (
          <Button onClick={() => this.socketConnectionClose()}>
            Close Connection
          </Button>
        );
      }
    }
  }

  renderSelectedItem() {
    const { selectedItem } = this.state;
    if (Object.keys(selectedItem).length > 0) {
      return <Drawer>{selectedItem.name}</Drawer>;
    }
    return null;
  }

  render() {
    const { svgUrl, socketConnectionStatus } = this.state;
    return (
      <div>
        <p>
          {this.renderSocketConnectionToggle()}
          <span> Status: {socketConnectionStatus}</span>
        </p>
        {this.renderSelectedItem()}
        <div style={{ position: "relative" }}>
          {this.renderZoomControls()}
          <svg
            ref={el => (this.mapSvg = el)}
            className={cssMapSvg}
            onClick={this.onMapClick.bind(this)}
            viewBox="0 0 1700 2200"
          >
            <g id="svg_parent">
              <image
                width="1700"
                height="2200"
                xlinkHref={svgUrl}
                ref={el => (this.mapImage = el)}
              />
              {this.renderTags()}
            </g>
          </svg>
        </div>
      </div>
    );
  }
}
