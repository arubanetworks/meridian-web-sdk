/** @jsx h */
import { h, Component } from "preact";
import PropTypes from "prop-types";
import throttle from "lodash.throttle";

import MapMarker from "./MapMarker";

export default class TagLayer extends Component {
  static defaultProps = {
    markers: {},
    onUpdate: () => {}
  };

  static propTypes = {
    selectedItem: PropTypes.object,
    isPanningOrZooming: PropTypes.bool.isRequired,
    mapZoomFactor: PropTypes.number.isRequired,
    locationID: PropTypes.string.isRequired,
    floorID: PropTypes.string.isRequired,
    api: PropTypes.object,
    markers: PropTypes.shape({
      filter: PropTypes.func,
      showControlTags: PropTypes.bool,
      disabled: PropTypes.bool
    }),
    onMarkerClick: PropTypes.func,
    onUpdate: PropTypes.func,
    toggleLoadingSpinner: PropTypes.func.isRequired
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

  getTags() {
    const { tagsByMAC } = this.state;
    const tags = [];
    for (const mac of Object.keys(tagsByMAC)) {
      tags.push(tagsByMAC[mac]);
    }
    return tags;
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
    return tags.reduce((obj, tag) => {
      obj[tag.mac] = tag;
      return obj;
    }, {});
  }

  setInitialTags(tags) {
    this.setState({ tagsByMAC: this.tagsByMAC(tags) }, () => {
      this.onUpdate();
      this.props.toggleLoadingSpinner({ show: false, source: "tags" });
    });
  }

  connect() {
    const { floorID, locationID, api, toggleLoadingSpinner } = this.props;
    toggleLoadingSpinner({ show: true, source: "tags" });
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

  filterControlTags(tags) {
    const { markers } = this.props;
    return tags.filter(tag => {
      if (markers.showControlTags !== true) {
        return !tag.editor_data.is_control_tag;
      }
      return true;
    });
  }

  filterTags(tags) {
    const { markers } = this.props;
    const { filter = () => true } = markers;
    return this.filterControlTags(tags).filter(filter);
  }

  onUpdate = () => {
    const { onUpdate, markers } = this.props;
    const { filter = () => true } = markers;
    const allTags = this.filterControlTags(this.getTags());
    const filteredTags = allTags.filter(filter);
    onUpdate({ allTags, filteredTags });
  };

  render() {
    const { selectedItem, markers, onMarkerClick, mapZoomFactor } = this.props;
    const filteredTags = this.filterTags(this.getTags());
    const filteredMarkers = filteredTags.map(tag => (
      <MapMarker
        selectedItem={selectedItem}
        mapZoomFactor={mapZoomFactor}
        key={tag.mac}
        kind="tag"
        data={tag}
        onClick={onMarkerClick}
        disabled={markers.disabled}
      />
    ));
    return <div>{filteredMarkers}</div>;
  }
}
