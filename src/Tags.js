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
    mapZoomFactor: PropTypes.number.isRequired,
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    api: PropTypes.object,
    markers: PropTypes.shape({
      all: PropTypes.bool,
      labels: PropTypes.arrayOf(PropTypes.string),
      ids: PropTypes.arrayOf(PropTypes.string)
    }),
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

  filterBy() {
    const { ids, labels } = this.props.markers;
    if (ids && Array.isArray(ids) && ids.length) {
      return "ID";
    } else if (labels && Array.isArray(labels) && labels.length) {
      return "CATEGORY";
    }
    return null;
  }

  isSingleTagSearch() {
    const { ids } = this.props.markers;
    return this.filterBy() === "ID" && ids.length === 1;
  }

  onFound = tag => {
    this.props.onFound(tag);
  };

  onUpdate = status => {
    const { connection, tagsByMAC } = this.state;
    const { markers, onUpdate } = this.props;
    if (this.isSingleTagSearch() && connection) {
      const tag = Object.keys(tagsByMAC)[0];
      if (tag) {
        this.onFound(tagsByMAC[tag]);
      } else {
        status = `Looking for tag #${markers.ids[0]}`;
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

  groupTagsByMAC(tags) {
    return tags.map(tag => this.normalizeTag(tag)).reduce((obj, tag) => {
      obj[tag.mac] = tag;
      return obj;
    }, {});
  }

  filterTagsByMAC(tags) {
    const { ids: macs } = this.props.markers;
    return Object.keys(tags).reduce((obj, mac) => {
      if (macs.includes(mac)) {
        obj[mac] = tags[mac];
      }
      return obj;
    }, {});
  }

  filterTagsByCategory(tags) {
    const { labels } = this.props.markers;
    return Object.keys(tags).reduce((obj, mac) => {
      const tag = tags[mac];
      const tagCatObjects = tag.data.tags;
      if (tagCatObjects.length) {
        const tagCats = tagCatObjects.map(obj => obj.name);
        const match = tagCats.some(category => labels.includes(category));
        if (match) {
          obj[mac] = tags[mac];
        }
      }
      return obj;
    }, {});
  }

  isMatch(tag) {
    const { markers } = this.props;
    const filterBy = this.filterBy();
    if (filterBy === "ID") {
      return markers.ids.includes(tag.mac);
    }
    if (filterBy === "CATEGORY") {
      const tagCatObjects = tag.data.tags;
      if (tagCatObjects.length) {
        const tagCats = tagCatObjects.map(obj => obj.name);
        return tagCats.some(category => markers.labels.includes(category));
      }
      return false;
    }
    return false;
  }

  removeTag(data) {
    this.setState(prevState => {
      const { tagsByMAC } = prevState;
      const macs = Object.keys(tagsByMAC);
      const newMACs = macs.filter(mac => mac !== data.mac);
      const newTagsByMAC = newMACs.reduce((obj, mac) => {
        obj[mac] = tagsByMAC[mac];
        return obj;
      }, {});
      return { tagsByMAC: newTagsByMAC };
    });
  }

  observeTagUpdate(data) {
    const { markers } = this.props;
    const tag = this.normalizeTag(data);
    if (markers.all || this.isMatch(tag)) {
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
    let tags = this.groupTagsByMAC(data);
    if (this.filterBy() === "ID") {
      tags = this.filterTagsByMAC(tags);
    }
    if (this.filterBy() === "CATEGORY") {
      tags = this.filterTagsByCategory(tags);
    }
    this.setState({ tagsByMAC: tags });
    this.onUpdate("Connected");
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
    const { onMarkerClick, mapZoomFactor } = this.props;
    const markers = Object.keys(tagsByMAC).map(mac => {
      const t = tagsByMAC[mac];
      const { x, y, name, data } = t;
      return (
        <MapMarker
          mapZoomFactor={mapZoomFactor}
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
