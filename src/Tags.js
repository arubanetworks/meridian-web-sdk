import { h, Component } from "preact";
import PropTypes from "prop-types";
import MapMarker from "./MapMarker";

class Tags extends Component {
  constructor(props) {
    super(props);
    let markers = props.markers;
    if (markers && typeof markers === "object" && markers.length === 1) {
      // TODO - not a long term solution
      this.setState({ singleTagSearch: true });
    }
  }
  static propTypes = {
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    api: PropTypes.object,
    markers: PropTypes.oneOfType([
      PropTypes.oneOf(["all"]),
      PropTypes.arrayOf(PropTypes.string)
    ]),
    onMarkerClick: PropTypes.func,
    onUpdate: PropTypes.func
  };

  static defaultProps = {
    markers: null,
    onUpdate: () => {},
    onFound: () => {}
  };

  state = {
    tagsById: {},
    singleTagSearch: false,
    connection: null
  };

  componentDidMount() {
    const { markers } = this.props;
    if (markers) {
      this.connect();
    }
  }

  onFound = tag => {
    this.props.onFound(tag);
  };

  onUpdate = status => {
    const { connection, tagsById, singleTagSearch } = this.state;
    if (singleTagSearch && connection) {
      const tag = Object.keys(tagsById)[0];
      if (tag) {
        this.onFound(tagsById[tag]);
      } else {
        status = `Looking for tag #${this.props.markers}`;
      }
    } else {
      status = status;
    }
    this.props.onUpdate(connection, status, tagsById);
  };

  connect() {
    // console.info("opening socket connection");
    const { floorID, locationID, api, markers } = this.props;
    const connection = api.openStream({
      locationID,
      id: floorID,
      onTagUpdate: data => {
        const { mac } = data;
        if (markers === "all" || markers.includes(mac)) {
          const { name } = data.editor_data;
          const { x, y } = data.calculations.default.location;
          const tag = { name, mac, x, y, data: data.editor_data };
          this.setState(
            prevState => ({
              tagsById: { ...prevState.tagsById, [mac]: tag }
            }),
            () => {
              this.onUpdate("Connected");
            }
          );
        }
      },
      onClose: () => {
        this.setState(
          {
            connection: null
          },
          () => {
            this.onUpdate("Not Connected");
          }
        );
      }
    });
    this.setState({ connection }, () => {
      this.onUpdate("Connected");
    });
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
          onClick={onMarkerClick}
        />
      );
    });
    return <g>{markers}</g>;
  }
}

export default Tags;
