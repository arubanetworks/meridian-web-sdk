/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import throttle from "lodash.throttle";
import { Component, h } from "preact";
import { PlacemarkData, TagData } from "./data";
import { MapComponentProps } from "./MapComponent";
import Tag from "./Tag";
import { keyBy, objectWithoutKey } from "./util";
import { API } from "./web-sdk";

export interface TagLayerProps {
  selectedItem?: TagData | PlacemarkData;
  isPanningOrZooming: boolean;
  mapZoomFactor: number;
  locationID: string;
  floorID: string;
  api: API;
  markers?: {
    filter?: (tag: TagData) => boolean;
    showControlTags?: boolean;
    disabled?: boolean;
  };
  onTagClick: (tag: TagData) => void;
  onUpdate: MapComponentProps["onTagsUpdate"];
  toggleLoadingSpinner: (options: { show: boolean; source: string }) => void;
}

export interface TagLayerState {
  tagsByMAC: Record<string, TagData>;
  connectionsByFloorID: Record<string, any>;
}

export default class TagLayer extends Component<TagLayerProps, TagLayerState> {
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
    // Don't re-render when panning only (no zoom change)
    return !(
      this.props.isPanningOrZooming &&
      nextProps.mapZoomFactor === this.props.mapZoomFactor
    );
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

  connect(floorID: string) {
    const { locationID, api, toggleLoadingSpinner } = this.props;
    toggleLoadingSpinner({ show: true, source: "tags" });
    const connection = api.openStream({
      locationID,
      floorID,
      onInitialTags: tags => {
        if (floorID === this.props.floorID && this.isMounted) {
          this.setState({ tagsByMAC: keyBy(tags, tag => tag.mac) }, () => {
            this.onUpdate();
            this.props.toggleLoadingSpinner({ show: false, source: "tags" });
          });
        }
      },
      onTagLeave: tag => {
        if (floorID === this.props.floorID && this.isMounted) {
          this.setState(({ tagsByMAC }) => {
            return objectWithoutKey(tagsByMAC, tag.mac);
          });
        }
      },
      onTagUpdate: tag => {
        if (floorID === this.props.floorID && this.isMounted) {
          this.tagUpdates = { ...this.tagUpdates, [tag.mac]: tag };
          if (!this.props.isPanningOrZooming) {
            this.commitTagUpdates();
          }
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

  filterControlTags(tags: TagData[]) {
    const { markers } = this.props;
    return tags.filter(tag => {
      if (markers?.showControlTags !== true) {
        return !tag.is_control_tag;
      }
      return true;
    });
  }

  onUpdate = () => {
    const { tagsByMAC } = this.state;
    const { onUpdate, markers = {} } = this.props;
    const { filter = () => true } = markers;
    const allTags = this.filterControlTags(Object.values(tagsByMAC));
    const filteredTags = allTags.filter(filter);
    if (onUpdate) {
      onUpdate({ allTags, filteredTags });
    }
  };

  render() {
    const {
      selectedItem,
      markers = {},
      onTagClick,
      mapZoomFactor
    } = this.props;
    const { tagsByMAC } = this.state;
    const { filter = () => true } = markers;
    const tags = Object.values(tagsByMAC);
    return (
      <div>
        {this.filterControlTags(tags)
          .filter(filter)
          .map(tag => (
            <Tag
              key={tag.mac}
              isSelected={selectedItem ? selectedItem.mac === tag.mac : false}
              mapZoomFactor={mapZoomFactor}
              data={tag}
              onClick={onTagClick}
              disabled={markers.disabled}
            />
          ))}
      </div>
    );
  }
}
