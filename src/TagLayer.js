/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { h, Component } from "preact";
import PropTypes from "prop-types";
import throttle from "lodash.throttle";

import MapMarker from "./MapMarker";
import { objectWithoutKey } from "./util";

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
      connectionsByFloorID: {}
    };
    this.tagUpdates = {};
    this.isMounted = false;
  }

  componentDidMount() {
    this.isMounted = true;
    const { markers } = this.props;
    if (markers) {
      this.connect(this.props.floorID);
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
      this.disconnect(prevProps.floorID);
      this.connect(this.props.floorID);
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
    this.disconnect(this.props.floorID);
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
    if (!this.isMounted) {
      return;
    }
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
    if (!this.isMounted) {
      return;
    }
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
    if (!this.isMounted) {
      return;
    }
    this.setState({ tagsByMAC: this.tagsByMAC(tags) }, () => {
      this.onUpdate();
      this.props.toggleLoadingSpinner({ show: false, source: "tags" });
    });
  }

  connect(floorID) {
    try {
      const { locationID, api, toggleLoadingSpinner } = this.props;
      toggleLoadingSpinner({ show: true, source: "tags" });
      const connection = api.openStream({
        locationID,
        floorID,
        onInitialTags: data => {
          if (floorID === this.props.floorID) {
            this.setInitialTags(data);
          }
        },
        onTagDisappear: data => {
          if (floorID === this.props.floorID) {
            this.removeTag(data);
          }
        },
        onTagUpdate: data => {
          if (floorID === this.props.floorID) {
            this.handleTagUpdates([data]);
          }
        }
      });
      if (!this.isMounted) {
        return;
      }
      this.setState(
        prevState => {
          return {
            connectionsByFloorID: {
              ...prevState.connectionsByFloorID,
              [floorID]: connection
            }
          };
        },
        () => {
          this.onUpdate();
        }
      );
    } catch (err) {
      this.props.toggleLoadingSpinner({ show: false, source: "tags" });
      throw err;
    }
  }

  disconnect(floorID) {
    const connection = this.state.connectionsByFloorID[floorID];
    if (connection) {
      connection.close();
    }
    this.tagUpdates = {};
    if (!this.isMounted) {
      return;
    }
    this.setState(
      prevState => {
        const tagsByMAC = { ...prevState.tagsByMAC };
        for (const mac of Object.keys(tagsByMAC)) {
          if (tagsByMAC[mac].map_id === floorID) {
            delete tagsByMAC[mac];
          }
        }
        const connectionsByFloorID = objectWithoutKey(
          prevState.connectionsByFloorID,
          floorID
        );
        return { tagsByMAC, connectionsByFloorID };
      },
      () => {
        this.onUpdate();
      }
    );
  }

  filterControlTags(tags) {
    const { markers } = this.props;
    return tags.filter(tag => {
      if (markers.showControlTags !== true) {
        return !tag.is_control_tag;
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
