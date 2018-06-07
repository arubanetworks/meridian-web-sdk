import { h, Component } from "preact";
import PropTypes from "prop-types";
import MapMarker from "./MapMarker";

export default class Tags extends Component {
  static defaultProps = {
    markers: null,
    onUpdate: () => {},
    onFound: () => {}
  };

  static propTypes = {
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    api: PropTypes.object,
    markers: PropTypes.oneOfType([
      PropTypes.oneOf(["all"]),
      PropTypes.arrayOf(PropTypes.string)
    ]),
    onMarkerClick: PropTypes.func,
    onUpdate: PropTypes.func,
    onFound: PropTypes.func
  };

  state = {
    tagsByMac: {},
    singleTagSearch: false,
    connection: null
  };

  componentDidMount() {
    const { markers } = this.props;
    if (markers) {
      this.connect();
    }
  }

  componentWillUnmount() {
    const { connection } = this.state;
    if (connection) {
      connection.close();
    }
  }

  isSingleTagSearch(markers) {
    return Array.isArray(markers) && markers.length === 1;
  }

  onFound = tag => {
    this.props.onFound(tag);
  };

  onUpdate = status => {
    const { connection, tagsByMac } = this.state;
    const { markers, onUpdate } = this.props;
    if (this.isSingleTagSearch(markers) && connection) {
      const tag = Object.keys(tagsByMac)[0];
      if (tag) {
        this.onFound(tagsByMac[tag]);
      } else {
        status = `Looking for tag #${markers}`;
      }
    }
    onUpdate(connection, status, tagsByMac);
  };

  normalizeTag(tag) {
    const { mac, editor_data: data } = tag;
    const { name } = data;
    const { x, y } = tag.calculations.default.location;
    return { name, mac, x, y, data };
  }

  groupTagsByMac(tags) {
    return tags.map(tag => this.normalizeTag(tag)).reduce((obj, tag) => {
      obj[tag.mac] = tag;
      return obj;
    }, {});
  }

  connect() {
    const { floorID, locationID, api, markers } = this.props;
    const connection = api.openStream({
      locationID,
      id: floorID,
      onInitialTags: data => {
        this.setState({ tagsByMac: this.groupTagsByMac(data) });
      },
      onTagUpdate: data => {
        const tag = this.normalizeTag(data);
        if (markers === "all" || markers.includes(tag.mac)) {
          this.setState(
            prevState => ({
              tagsByMac: {
                ...prevState.tagsByMac,
                [tag.mac]: tag
              }
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
    const { tagsByMac } = this.state;
    const { onMarkerClick } = this.props;
    const markers = Object.keys(tagsByMac).map(mac => {
      const t = tagsByMac[mac];
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
