/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import throttle from "lodash.throttle";
import { Component, h } from "preact";
import { MapComponentProps } from "./MapComponent";
import Tag from "./Tag";
import { keyBy, objectWithoutKey } from "./util";
import { API, PlacemarkData, TagData } from "./web-sdk";

export interface TagLayerProps {
  selectedItem?: TagData | PlacemarkData;
  isPanningOrZooming: boolean;
  mapZoomFactor: number;
  locationID: string;
  floorID: string;
  api: API;
  tagOptions?: {
    filter?: (tag: TagData) => boolean;
    showControlTags?: boolean;
    disabled?: boolean;
    updateInterval?: number;
  };
  onTagClick: (tag: TagData) => void;
  onUpdate: MapComponentProps["onTagsUpdate"];
  toggleLoadingSpinner: (options: { show: boolean; source: string }) => void;
  onInit: () => void;
}

export interface TagLayerState {
  tagsByMAC: Record<string, TagData>;
  connectionsByFloorID: Record<string, any>;
}

export default class TagLayer extends Component<TagLayerProps, TagLayerState> {
  state: TagLayerState = {
    tagsByMAC: {},
    connectionsByFloorID: {},
  };
  tagUpdates = {};
  isMounted = false;

  componentDidMount() {
    this.isMounted = true;
    const { floorID } = this.props;
    if (floorID) {
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
      (prevState) => ({
        tagsByMAC: {
          ...prevState.tagsByMAC,
          ...this.tagUpdates,
        },
      }),
      () => {
        this.tagUpdates = {};
        this.onUpdate();
      }
    );
  }, this.props.tagOptions?.updateInterval || 5000);

  connect(floorID: string) {
    const { locationID, api, toggleLoadingSpinner, onInit } = this.props;
    toggleLoadingSpinner({ show: true, source: "tags" });
    const connection = api.openStream({
      locationID,
      floorID,
      onInitialTags: (tags) => {
        if (floorID === this.props.floorID && this.isMounted) {
          this.setState({ tagsByMAC: keyBy(tags, (tag) => tag.mac) }, () => {
            this.onUpdate();
            this.props.toggleLoadingSpinner({ show: false, source: "tags" });
          });
          onInit();
        }
      },
      onTagUpdate: (tag) => {
        if (floorID === this.props.floorID && this.isMounted) {
          this.tagUpdates = { ...this.tagUpdates, [tag.mac]: tag };
          if (floorID !== tag.map_id) {
            this.setState(({ tagsByMAC }) => {
              return objectWithoutKey(tagsByMAC, tag.mac);
            });
          }
          if (!this.props.isPanningOrZooming) {
            this.commitTagUpdates();
          }
        }
      },
      onClose: () => {
        this.props.toggleLoadingSpinner({ show: false, source: "tags" });
      },
    });
    if (!this.isMounted) {
      return;
    }
    this.setState(
      (prevState) => {
        return {
          connectionsByFloorID: {
            ...prevState.connectionsByFloorID,
            [floorID]: connection,
          },
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
      (prevState) => {
        const connectionsByFloorID = objectWithoutKey(
          prevState.connectionsByFloorID,
          floorID
        );
        return { tagsByMAC: {}, connectionsByFloorID };
      },
      () => {
        this.onUpdate();
      }
    );
  }

  filterControlTags(tags: TagData[]) {
    const { tagOptions } = this.props;
    return tags.filter((tag) => {
      if (tagOptions?.showControlTags !== true) {
        return !tag.is_control_tag;
      }
      return true;
    });
  }

  onUpdate = () => {
    const { tagsByMAC } = this.state;
    const { onUpdate, tagOptions = {} } = this.props;
    const { filter = () => true } = tagOptions;
    const allTags = this.filterControlTags(Object.values(tagsByMAC));
    const filteredTags = allTags.filter(filter);
    if (onUpdate) {
      onUpdate({ allTags, filteredTags });
    }
  };

  render() {
    const {
      selectedItem,
      tagOptions = {},
      onTagClick,
      mapZoomFactor,
    } = this.props;
    const { tagsByMAC } = this.state;
    const { filter = () => true } = tagOptions;
    const tags = Object.values(tagsByMAC);
    return (
      <div data-testid="meridian--private--tag-layer">
        {this.filterControlTags(tags)
          .filter(filter)
          .map((tag) => (
            <Tag
              key={tag.mac}
              isSelected={selectedItem ? selectedItem.mac === tag.mac : false}
              mapZoomFactor={mapZoomFactor}
              data={tag}
              onClick={onTagClick}
              disabled={tagOptions.disabled}
            />
          ))}
      </div>
    );
  }
}
