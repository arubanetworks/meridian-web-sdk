/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import groupBy from "lodash.groupby";
import { Component, createRef, h } from "preact";
import IconSpinner from "./IconSpinner";
import LabelList from "./LabelList";
import Overlay from "./Overlay";
import OverlaySearchBar, { FilterType } from "./OverlaySearchBar";
import { css, mixins, theme } from "./style";
import { createSearchMatcher, getTagLabels, uiText } from "./util";
import { API, CreateMapOptions, FloorData, TagData } from "./web-sdk";

export interface TagListOverlayProps {
  onTagClick: (tag: TagData) => void;
  loading: boolean;
  tags: TagData[];
  showControlTags: boolean;
  floors: FloorData[];
  tagOptions: CreateMapOptions["tags"];
  updateMap: (options: CreateMapOptions) => void;
  api: API;
  locationID: string;
  currentFloorID: string;
  toggleTagListOverlay: (options: { open: boolean }) => void;
}

class TagListOverlay extends Component<TagListOverlayProps> {
  state: { searchFilter: string; radioFilter: FilterType } = {
    searchFilter: "",
    radioFilter: "TAGS",
  };
  searchInputRef = createRef<HTMLInputElement>();

  setRadioFilter = (filter: FilterType) => {
    this.setState({ radioFilter: filter });
  };

  componentDidMount() {
    if (this.searchInputRef.current) {
      this.searchInputRef.current.focus();
    }
  }

  render() {
    const {
      currentFloorID,
      floors,
      updateMap,
      tagOptions = {},
      tags,
      loading,
      onTagClick,
      toggleTagListOverlay,
    } = this.props;
    const { searchFilter } = this.state;
    const match = createSearchMatcher(searchFilter);
    const floorsByID = groupBy(floors, (floor) => floor.id);
    const processedTags = tags
      // Remove tags from unpublished floors
      .filter((tag) => {
        const floor = floorsByID[tag.map_id][0];
        if (floor) {
          return floor.published;
        }
        return true;
      })
      // Remove tags that don't match the local search terms
      .filter((tag) => {
        return (
          match(tag.name) || match(tag.mac) || getTagLabels(tag).some(match)
        );
      })
      // Remove control tags unless the developer wants them
      .filter((tag) => {
        if (tagOptions.showControlTags !== true) {
          return !tag.is_control_tag;
        }
        return true;
      })
      // Sort by name
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    const floorToGroup: Record<string, string> = {};
    for (const floor of floors) {
      floorToGroup[floor.id] = [
        floor.group_name || uiText.unnamedBuilding,
        uiText.enDash,
        floor.name,
      ].join(" ");
    }
    const organizedTags = groupBy(processedTags, (tag) => {
      return floorToGroup[tag.map_id];
    });
    const sortedGroups = Object.keys(organizedTags).sort();
    sortedGroups.forEach((group, index) => {
      const floors = organizedTags[group];
      if (floors[0].map_id === currentFloorID) {
        const [currentGroup] = sortedGroups.splice(index, 1);
        sortedGroups.unshift(currentGroup);
      }
    });
    return (
      <Overlay
        position="right"
        onCloseClicked={() => {
          toggleTagListOverlay({ open: false });
        }}
      >
        <OverlaySearchBar
          value={searchFilter}
          radioValue="TAGS"
          onChange={(searchFilter) => {
            this.setState({ searchFilter });
          }}
        />
        {(() => {
          if (loading) {
            return (
              <div className={cssTagListEmpty}>
                <IconSpinner />
              </div>
            );
          }
          if (processedTags.length === 0) {
            return (
              <div className={cssTagListEmpty}>{uiText.noResultsFound}</div>
            );
          }
          return (
            <div className={cssTagList}>
              {sortedGroups.map((buildingName) => (
                <div key={buildingName}>
                  <div className={cssOverlayBuildingName}>{buildingName}</div>
                  {organizedTags[buildingName].map((tag) => (
                    <button
                      key={tag.id}
                      data-testid={`meridian--private--overlay-tag-${tag.id}`}
                      className={cssOverlayTagButton}
                      onClick={() => {
                        updateMap({
                          locationID: tag.location_id,
                          floorID: tag.map_id,
                          tags: { ...tagOptions, filter: () => true },
                        });
                        onTagClick(tag);
                        toggleTagListOverlay({ open: false });
                      }}
                    >
                      <div className={cssOverlayTagButtonInner}>
                        <div className={cssOverlayTagButtonName}>
                          {tag.name}
                        </div>
                        <LabelList
                          align="right"
                          labels={getTagLabels(tag)}
                          fontSize={theme.fontSizeSmallest}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          );
        })()}
      </Overlay>
    );
  }
}

const cssOverlayBuildingName = css({
  label: "overlay-building-name",
  top: 0,
  position: "sticky",
  textTransform: "uppercase",
  fontWeight: "bold",
  color: theme.brandBlue,
  background: theme.almostWhite,
  fontSize: theme.fontSizeSmaller,
  padding: 10,
});

const cssTagList = css({
  label: "tags-list",
  overflowY: "auto",
  flex: "1 1 auto",
});

const cssOverlayTagButton = css(
  mixins.buttonReset,
  mixins.focusRingMenuItem,
  mixins.buttonHoverActive,
  {
    label: "overlay-tags-button",
    minHeight: 56,
    padding: 10,
    paddingLeft: 20,
    display: "block",
    width: "100%",
    textAlign: "left",
  }
);

const cssOverlayTagButtonInner = css(mixins.flexRow, {
  label: "overlay-tags-button-inner",
  alignItems: "center",
});

const cssOverlayTagButtonName = css({
  label: "overlay-tags-button-name",
  flex: "1 1 auto",
});

const cssTagListEmpty = css({
  label: "overlay-tags-list-empty",
  padding: "60px 20px",
  textAlign: "center",
  fontSize: theme.fontSizeBigger,
  color: theme.textColorBluish,
});

export default TagListOverlay;
