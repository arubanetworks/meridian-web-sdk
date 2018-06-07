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
    tagsByMAC: {},
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
    const { connection, tagsByMAC } = this.state;
    const { markers, onUpdate } = this.props;
    if (this.isSingleTagSearch(markers) && connection) {
      const tag = Object.keys(tagsByMAC)[0];
      if (tag) {
        this.onFound(tagsByMAC[tag]);
      } else {
        status = `Looking for tag #${markers}`;
      }
    }
    onUpdate(connection, status, tagsByMAC);
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

  removeTag(data) {
    this.setState(prevState => {
      const { tagsByMAC } = prevState;
      const macs = Object.keys(tagsByMAC);
      const newMACs = macs.filter(mac => mac !== data.mac);
      const newTagsByMac = newMACs.reduce((obj, mac) => {
        obj[mac] = tagsByMAC[mac];
        return obj;
      }, {});
      return { tagsByMAC: newTagsByMac };
    });
  }

  observeTagUpdate(data) {
    const { markers } = this.props;
    const tag = this.normalizeTag(data);
    if (markers === "all" || markers.includes(tag.mac)) {
      this.setState(
        prevState => ({
          tagsByMAC: {
            ...prevState.tagsByMAC,
            [tag.mac]: tag
          }
        }),
        () => {
          this.onUpdate("Connected");
        }
      );
    }
  }

  setInitialTags(data) {
    this.setState({ tagsByMAC: this.groupTagsByMac(data) });
  }

  connect() {
    const { floorID, locationID, api } = this.props;
    const connection = api.openStream({
      locationID,
      id: floorID,
      onInitialTags: data => {
        this.setInitialTags(data);
      },
      onTagDisappear: data => {
        this.removeTag(data);
      },
      onTagUpdate: data => {
        this.observeTagUpdate(data);
      },
      onClose: () => {
        this.setState({ connection: null }, () => {
          this.onUpdate("Not Connected");
        });
      }
    });
    this.setState({ connection }, () => {
      this.onUpdate("Connected");
    });
  }

  render() {
    const { tagsByMAC } = this.state;
    const { onMarkerClick } = this.props;
    const markers = Object.keys(tagsByMAC).map(mac => {
      const t = tagsByMAC[mac];
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
