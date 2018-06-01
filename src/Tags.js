import { h, Component } from "preact";
import PropTypes from "prop-types";
import MapMarker from "./MapMarker";

class Tags extends Component {
  static propTypes = {
    locationId: PropTypes.string.isRequired,
    floorId: PropTypes.string.isRequired,
    api: PropTypes.object,
    markers: PropTypes.oneOfType([
      PropTypes.oneOf(["all"]),
      PropTypes.arrayOf(PropTypes.string)
    ]),
    onMarkerClick: PropTypes.func
  };
  static defaultProps = {
    markers: {}
  };
  state = {
    tagsById: {},
    svgUrl: null,
    socketConnection: null,
    socketConnectionStatus: "Not connected"
  };

  async componentDidMount() {
    const { markers } = this.props;
    if (markers) {
      this.socketConnectionOpen();
    }
  }

  socketConnectionOpen() {
    console.info("opening socket connection");
    const { floorId, locationId, api, markers } = this.props;
    const socketConnection = api.floor.listen({
      locationId: locationId,
      id: floorId,
      onUpdate: data => {
        const { mac } = data;
        if (markers === "all" || markers.includes(mac)) {
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

  render() {
    const { tagsById } = this.state;
    const { onMarkerClick } = this.props;
    const markers = Object.keys(tagsById).map(mac => {
      const t = tagsById[mac];
      const { x, y, name, data } = t;
      return (
        <MapMarker
          kind="tag"
          mac={mac}
          x={x}
          y={y}
          name={name}
          data={data}
          onMarkerClick={onMarkerClick}
        />
      );
    });
    return <g>{markers}</g>;
  }
}

export default Tags;
