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
    onMarkerClick: PropTypes.func,
    onUpdate: PropTypes.func
  };

  static defaultProps = {
    markers: {},
    onUpdate: () => {}
  };

  state = {
    tagsById: {},
    svgUrl: null,
    connection: null,
    status: "Not connected"
  };

  componentDidMount() {
    const { markers } = this.props;
    if (markers) {
      this.connect();
    }
  }

  onUpdate() {
    const { connection, status } = this.state;
    const { onUpdate } = this.props;
    onUpdate(connection, status);
  }

  connect() {
    // console.info("opening socket connection");
    const { floorId, locationId, api, markers } = this.props;
    const connection = api.openStream({
      locationId: locationId,
      id: floorId,
      onTagUpdate: data => {
        const { mac } = data;
        if (markers === "all" || markers.includes(mac)) {
          const { name } = data.editor_data;
          const { x, y } = data.calculations.default.location;
          const tag = { name, mac, x, y, data: data.editor_data };
          this.setState(
            prevState => ({
              status: "Connected",
              tagsById: { ...prevState.tagsById, [mac]: tag }
            }),
            this.onUpdate
          );
        }
      },
      onClose: () => {
        this.setState(
          {
            connection: null,
            status: "Closed"
          },
          this.onUpdate
        );
      }
    });
    this.setState({ connection });
  }

  render() {
    const { tagsById } = this.state;
    const { onMarkerClick } = this.props;
    const markers = Object.keys(tagsById).map(mac => {
      const t = tagsById[mac];
      const { x, y, name, data } = t;
      return (
        <MapMarker
          key={mac}
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
