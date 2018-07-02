import { h, Component } from "preact";
import PropTypes from "prop-types";
import throttle from "lodash.throttle";

import MapMarker from "./MapMarker";

export default class TagLayer extends Component {
  static defaultProps = {
    markers: {},
    onUpdate: () => {},
    onFound: () => {}
  };

  static propTypes = {
    isPanningOrZooming: PropTypes.bool.isRequired,
    mapZoomFactor: PropTypes.number.isRequired,
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    api: PropTypes.object,
    markers: PropTypes.shape({
      all: PropTypes.bool,
      labels: PropTypes.arrayOf(PropTypes.string),
      ids: PropTypes.arrayOf(PropTypes.string),
      disabled: PropTypes.bool
    }),
    onMarkerClick: PropTypes.func,
    onUpdate: PropTypes.func,
    onFound: PropTypes.func
  };

  state = {
    tagsByMAC: {},
    connection: null
  };

  componentDidMount() {
    const { markers } = this.props;
    if (markers) {
      this.connect();
    }
  }

  shouldComponentUpdate(nextProps) {
    const zoomChanged = nextProps.mapZoomFactor !== this.props.mapZoomFactor;
    // don't re-render when panning only (no zoom change)
    if (this.props.isPanningOrZooming && !zoomChanged) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    const { connection } = this.state;
    if (connection) {
      connection.close();
    }
  }

  tagUpdates = {};

  isSingleTagSearch() {
    const { ids } = this.props.markers;
    return ids && Array.isArray(ids) && ids.length === 1;
  }

  onFound = tag => {
    this.props.onFound(tag);
  };

  onUpdate = status => {
    const { connection, tagsByMAC } = this.state;
    const { markers, onUpdate } = this.props;
    if (this.isSingleTagSearch() && connection) {
      const mac = markers.ids[0];
      const tag = tagsByMAC[mac];
      if (tag) {
        this.onFound(tag);
      } else {
        status = `Looking for tag ${mac}`;
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

  getFilterFunction() {
    const { markers } = this.props;
    const { ids, labels, all } = markers;
    if (all) {
      return () => true;
    } else if (ids && Array.isArray(ids) && ids.length > 0) {
      return tag => markers.ids.includes(tag.mac);
    } else if (labels && Array.isArray(labels) && labels.length > 0) {
      return tag => {
        const tagCatObjects = tag.data.tags;
        if (tagCatObjects.length) {
          const tagCats = tagCatObjects.map(obj => obj.name);
          return tagCats.some(category => markers.labels.includes(category));
        }
        return false;
      };
    }
    return () => false;
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

  handleTagUpdates(data) {
    const { isPanningOrZooming } = this.props;
    this.tagUpdates = {
      ...this.tagUpdates,
      ...this.tagsByMAC(data)
    };
    if (!isPanningOrZooming) {
      this.commitTagUpdates();
    }
  }

  commitTagUpdates = throttle(() => {
    this.setState(
      prevState => ({
        tagsByMAC: {
          ...prevState.tagsByMAC,
          ...this.tagUpdates
        }
      }),
      () => {
        this.tagUpdates = {};
        this.onUpdate("Connected");
      }
    );
  }, 1000);

  tagsByMAC(tags) {
    return tags.map(tag => this.normalizeTag(tag)).reduce((obj, tag) => {
      obj[tag.mac] = tag;
      return obj;
    }, {});
  }

  setInitialTags(tags) {
    this.setState({ tagsByMAC: this.tagsByMAC(tags) });
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
        this.handleTagUpdates([data]);
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
    // console.info("Render > TagLayer", Math.floor(Date.now() / 1000));
    const { tagsByMAC } = this.state;
    const { markers, onMarkerClick, mapZoomFactor } = this.props;
    const filter = this.getFilterFunction();
    const filteredMarkers = Object.keys(tagsByMAC)
      .map(mac => tagsByMAC[mac])
      .filter(filter)
      .map(tag => (
        <MapMarker
          mapZoomFactor={mapZoomFactor}
          key={tag.mac}
          kind="tag"
          mac={tag.mac}
          x={tag.x}
          y={tag.y}
          name={tag.name}
          data={tag.data}
          onClick={onMarkerClick}
          disabled={markers.disabled}
        />
      ));
    return <div>{filteredMarkers}</div>;
  }
}
