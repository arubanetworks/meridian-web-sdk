import { h, Component } from "preact";
import PropTypes from "prop-types";
import throttle from "lodash.throttle";

import MapMarker from "./MapMarker";
import { normalizeTag } from "./util";

export default class TagLayer extends Component {
  static defaultProps = {
    markers: {},
    onUpdate: () => {}
  };

  static propTypes = {
    isPanningOrZooming: PropTypes.bool.isRequired,
    mapZoomFactor: PropTypes.number.isRequired,
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    api: PropTypes.object,
    markers: PropTypes.shape({
      all: PropTypes.bool,
      showControlTags: PropTypes.bool,
      labels: PropTypes.arrayOf(PropTypes.string),
      ids: PropTypes.arrayOf(PropTypes.string),
      disabled: PropTypes.bool
    }),
    onMarkerClick: PropTypes.func,
    onUpdate: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      tagsByMAC: {},
      connection: null
    };
    this.tagUpdates = {};
  }

  componentDidMount() {
    const { markers } = this.props;
    if (markers) {
      this.connect();
    }
  }

  shouldComponentUpdate(nextProps) {
    const zoomChanged = nextProps.mapZoomFactor !== this.props.mapZoomFactor;
    // Don't re-render when panning only (no zoom change)
    if (this.props.isPanningOrZooming && !zoomChanged) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.floorID !== this.props.floorID) {
      this.disconnect();
      this.connect();
    }
  }

  componentWillUnmount() {
    this.disconnect();
  }

  onUpdate = () => {
    const { tagsByMAC } = this.state;
    const { onUpdate } = this.props;
    onUpdate(tagsByMAC);
  };

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
        this.onUpdate();
      }
    );
  }, 1000);

  tagsByMAC(tags) {
    return tags.map(tag => normalizeTag(tag)).reduce((obj, tag) => {
      obj[tag.mac] = tag;
      return obj;
    }, {});
  }

  setInitialTags(tags) {
    this.setState({ tagsByMAC: this.tagsByMAC(tags) }, () => this.onUpdate());
  }

  connect() {
    const { floorID, locationID, api } = this.props;
    const connection = api.openStream({
      locationID,
      floorID,
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
          this.onUpdate();
        });
      }
    });
    this.setState({ connection }, () => {
      this.onUpdate();
    });
  }

  disconnect() {
    const { connection } = this.state;
    if (connection) {
      connection.close();
      this.tagUpdates = {};
      this.setState({ tagsByMAC: {} });
    }
  }

  render() {
    const { tagsByMAC } = this.state;
    const { markers, onMarkerClick, mapZoomFactor } = this.props;
    const filter = this.getFilterFunction();
    const filteredMarkers = Object.keys(tagsByMAC)
      .map(mac => tagsByMAC[mac])
      .filter(tag => {
        if (markers.showControlTags !== true) {
          return !tag.data.is_control_tag;
        }
        return true;
      })
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
