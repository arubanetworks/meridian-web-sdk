/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import throttle from "lodash.throttle";
import { Component, h } from "preact";
import MapMarker from "./MapMarker";
import { objectWithoutKey } from "./util";
import { API } from "./web-sdk";

export interface TagLayerProps {
  selectedItem?: Record<string, any>;
  isPanningOrZooming: boolean;
  mapZoomFactor: number;
  locationID: string;
  floorID: string;
  api: API;
  markers?: {
    filter?: (tag: Record<string, any>) => boolean;
    showControlTags?: boolean;
    disabled?: boolean;
  };
  onMarkerClick: (tag: Record<string, any>) => void;
  onUpdate: (data: {
    allTags: Record<string, any>[];
    filteredTags: Record<string, any>[];
  }) => void;
  toggleLoadingSpinner: (options: { show: boolean; source: string }) => void;
}

export interface TagLayerState {
  tagsByMAC: Record<string, Record<string, any>>;
  connectionsByFloorID: Record<string, any>;
}

export default class TagLayer extends Component<TagLayerProps, TagLayerState> {
  static defaultProps = {
    markers: {},
    onUpdate: () => {}
  };

  state: TagLayerState = {
    tagsByMAC: {},
    connectionsByFloorID: {}
  };
  tagUpdates = {};
  isMounted = false;

  componentDidMount() {
    this.isMounted = true;
    const { markers, floorID } = this.props;
    if (markers) {
      this.connect(floorID);
    }
  }

  shouldComponentUpdate(nextProps: TagLayerProps) {
    const zoomChanged = nextProps.mapZoomFactor !== this.props.mapZoomFactor;
    // Don't re-render when panning only (no zoom change)
    if (this.props.isPanningOrZooming && !zoomChanged) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps: TagLayerProps) {
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

  removeTag(tag: Record<string, any>) {
    if (!this.isMounted) {
      return;
    }
    this.setState(prevState => {
      const { tagsByMAC } = prevState;
      const macs = Object.keys(tagsByMAC);
      const newMACs = macs.filter(mac => mac !== tag.mac);
      const newTagsByMAC = newMACs.reduce((obj, mac) => {
        obj[mac] = tagsByMAC[mac];
        return obj;
      }, {} as Record<string, Record<string, any>>);
      return { tagsByMAC: newTagsByMAC };
    });
  }

  handleTagUpdates(tags: Record<string, any>[]) {
    const { isPanningOrZooming } = this.props;
    this.tagUpdates = {
      ...this.tagUpdates,
      ...this.tagsByMAC(tags)
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

  tagsByMAC(tags: Record<string, any>[]) {
    return tags.reduce((obj, tag) => {
      obj[tag.mac] = tag;
      return obj;
    }, {} as Record<string, Record<string, any>>);
  }

  setInitialTags(tags: Record<string, any>[]) {
    if (!this.isMounted) {
      return;
    }
    this.setState({ tagsByMAC: this.tagsByMAC(tags) }, () => {
      this.onUpdate();
      this.props.toggleLoadingSpinner({ show: false, source: "tags" });
    });
  }

  connect(floorID: string) {
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
      onTagLeave: data => {
        if (floorID === this.props.floorID) {
          this.removeTag(data);
        }
      },
      onTagUpdate: data => {
        if (floorID === this.props.floorID) {
          this.handleTagUpdates([data]);
        }
      },
      onClose: () => {
        this.props.toggleLoadingSpinner({ show: false, source: "tags" });
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
  }

  disconnect(floorID: string) {
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

  filterControlTags(tags: Record<string, any>[]) {
    const { markers } = this.props;
    return tags.filter(tag => {
      if (markers?.showControlTags !== true) {
        return !tag.is_control_tag;
      }
      return true;
    });
  }

  filterTags(tags: Record<string, any>[]) {
    const { markers = {} } = this.props;
    const { filter = () => true } = markers;
    return this.filterControlTags(tags).filter(filter);
  }

  onUpdate = () => {
    const { onUpdate, markers = {} } = this.props;
    const { filter = () => true } = markers;
    const allTags = this.filterControlTags(this.getTags());
    const filteredTags = allTags.filter(filter);
    onUpdate({ allTags, filteredTags });
  };

  render() {
    const {
      selectedItem,
      markers = {},
      onMarkerClick,
      mapZoomFactor
    } = this.props;
    return (
      <div>
        {this.filterTags(this.getTags()).map(tag => (
          <MapMarker
            selectedItem={selectedItem}
            mapZoomFactor={mapZoomFactor}
            key={tag.mac}
            kind="tag"
            data={tag}
            onClick={onMarkerClick}
            disabled={markers.disabled}
          />
        ))}
      </div>
    );
  }
}
