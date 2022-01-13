/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import groupBy from "lodash.groupby";
import { Component, createRef, h } from "preact";
import { useState, useEffect } from "preact/hooks";
import IconSpinner from "./IconSpinner";
import LabelList from "./LabelList";
import Overlay from "./Overlay";
import OverlaySearchBar from "./OverlaySearchBar";
import { css, mixins, theme } from "./style";
import { createSearchMatcher, getTagLabels, uiText } from "./util";
import {
  API,
  CreateMapOptions,
  FloorData,
  PlacemarkData,
  TagData,
} from "./web-sdk";

type FilterType = "TAGS" | "PLACEMARKS";

export interface AssetListOverlayProps {
  onTagClick: (tag: TagData) => void;
  onPlacemarkClick: (placemark: PlacemarkData) => void;
  loading: boolean;
  tags: TagData[];
  showControlTags: boolean;
  floors: FloorData[];
  tagOptions: CreateMapOptions["tags"];
  updateMap: (options: CreateMapOptions) => void;
  api: API;
  locationID: string;
  currentFloorID: string;
  toggleAssetListOverlay: (options: { open: boolean }) => void;
  showTags: boolean;
}

function TagResults(props: any) {
  const {
    currentFloorID,
    // floors,
    updateMap,
    tagOptions = {},
    tags,
    // loading,
    onTagClick,
    toggleAssetListOverlay,
    match,
    floorsByID,
    floorToGroup,
  } = props;

  const processedTags = tags
    // Remove tags from unpublished floors
    .filter((tag: TagData) => {
      const floor = floorsByID[tag.map_id][0];
      if (floor) {
        return floor.published;
      }
      return true;
    })
    // Remove tags that don't match the local search terms
    .filter((tag: TagData) => {
      return match(tag.name) || match(tag.mac) || getTagLabels(tag).some(match);
    })
    // Remove control tags unless the developer wants them
    .filter((tag: TagData) => {
      if (tagOptions.showControlTags !== true) {
        return !tag.is_control_tag;
      }
      return true;
    })
    // Sort by name
    .sort((a: TagData, b: TagData) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

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

  if (processedTags.length === 0) {
    return <div className={cssTagListEmpty}>{uiText.noResultsFound}</div>;
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
                toggleAssetListOverlay({ open: false });
              }}
            >
              <div className={cssOverlayTagButtonInner}>
                <div className={cssOverlayTagButtonName}>{tag.name}</div>
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
}

export interface PlacemarkResultsProps extends AssetListOverlayProps {
  searchStr: string;
  floorToGroup: any; // what again is this?
  floorsByID: any; // what again is this?
}

function PlacemarkResults(props: PlacemarkResultsProps) {
  const {
    currentFloorID,
    updateMap,
    tagOptions = {},
    toggleAssetListOverlay,
    floorToGroup,
    searchStr,
    api,
    onPlacemarkClick,
  } = props;

  const [searchResults, setSearchResults] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const res = await api.searchPlacemarks("5198682008846336", searchStr);
      setSearchResults(res.data.results);
    })();
  }, [searchStr, api]);

  const organizedPlacemarks = groupBy(searchResults, (placemark) => {
    return floorToGroup[placemark.map_id];
  });

  const sortedGroups = Object.keys(organizedPlacemarks).sort();

  sortedGroups.forEach((group, index) => {
    const floors = organizedPlacemarks[group];
    if (floors[0].map_id === currentFloorID) {
      const [currentGroup] = sortedGroups.splice(index, 1);
      sortedGroups.unshift(currentGroup);
    }
  });

  if (searchResults.length === 0) {
    return <div className={cssTagListEmpty}>{uiText.noResultsFound}</div>;
  }

  return (
    <div className={cssTagList}>
      {sortedGroups.map((buildingName) => (
        <div key={buildingName}>
          <div className={cssOverlayBuildingName}>{buildingName}</div>
          {organizedPlacemarks[buildingName].map((placemark) => (
            <button
              key={placemark.id}
              data-testid={`meridian--private--overlay-tag-${placemark.id}`}
              className={cssOverlayTagButton}
              onClick={() => {
                updateMap({
                  // TODO HARDCODED --------------
                  locationID: "5198682008846336",
                  floorID: placemark.map_id,
                  tags: { ...tagOptions, filter: () => true },
                });
                // TODO ANY ANY ANY ANY and Tag specific
                onPlacemarkClick(placemark as any);
                toggleAssetListOverlay({ open: false });
              }}
            >
              <div className={cssOverlayTagButtonName}>{placemark.name}</div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

class AssetListOverlay extends Component<AssetListOverlayProps> {
  state: { searchFilter: string; radioValue: FilterType } = {
    searchFilter: "",
    radioValue: "TAGS",
  };
  searchInputRef = createRef<HTMLInputElement>();

  setRadioFilter = (filter: FilterType) => {
    this.setState({ radioValue: filter });
  };

  componentDidMount() {
    if (this.searchInputRef.current) {
      this.searchInputRef.current.focus();
    }
  }

  render() {
    const { floors, loading, toggleAssetListOverlay, showTags } = this.props;

    const { searchFilter } = this.state;
    const match = createSearchMatcher(searchFilter);
    const floorsByID = groupBy(floors, (floor) => floor.id);
    const floorToGroup: Record<string, string> = {};

    for (const floor of floors) {
      floorToGroup[floor.id] = [
        floor.group_name || uiText.unnamedBuilding,
        uiText.enDash,
        floor.name,
      ].join(" ");
    }

    return (
      <Overlay
        position="right"
        onCloseClicked={() => {
          toggleAssetListOverlay({ open: false });
        }}
      >
        <OverlaySearchBar
          value={searchFilter}
          onChange={(searchFilter) => {
            this.setState({ searchFilter });
          }}
        />
        {showTags ? (
          <div className={cssRadioContainer}>
            <input
              type="radio"
              name="searchType"
              id="tags"
              className={cssRadioButton}
              checked={this.state.radioValue === "TAGS"}
              onChange={(event: any) => {
                if (event.target.checked) {
                  this.setRadioFilter("TAGS");
                }
              }}
            />
            <label for="tags" className={cssRadioButtonLabel}>
              Tags
            </label>
            <input
              type="radio"
              name="searchType"
              id="placemarks"
              className={cssRadioButton}
              checked={this.state.radioValue === "PLACEMARKS"}
              onChange={(event: any) => {
                if (event.target.checked) {
                  this.setRadioFilter("PLACEMARKS");
                }
              }}
            />
            <label for="placemarks" className={cssRadioButtonLabel}>
              Placemarks
            </label>
          </div>
        ) : null}

        {(() => {
          if (loading) {
            return (
              <div className={cssTagListEmpty}>
                <IconSpinner />
              </div>
            );
          }

          if (this.state.radioValue === "TAGS") {
            return (
              <TagResults
                {...this.props}
                floorToGroup={floorToGroup}
                floorsByID={floorsByID}
                match={match}
              />
            );
          }
          return (
            <PlacemarkResults
              {...this.props}
              floorToGroup={floorToGroup}
              floorsByID={floorsByID}
              searchStr={this.state.searchFilter}
              api={this.props.api}
            />
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

const cssRadioButtonLabel = css({
  label: "overlay-radio-label",
  color: "white",
  padding: "2px 10px 0px 4px",
});

const cssRadioButton = css({
  label: "overlay-radio-button",

  WebkitAppearance: "none",

  position: "relative",
  boxSizing: "border-box",
  border: `1px solid rgb(224,224,225)`,
  width: 16,
  height: 16,
  background: "white",
  borderRadius: 9999,
  cursor: "pointer",
  boxShadow: `inset 0 2px 2px rgba(0, 0, 0, 0.1)`,

  "&:focus": {
    outline: "none",
    borderColor: theme.searchBarColor,
    borderWidth: 2,
  },

  "&:checked": {
    "--circle-color": theme.searchBarColor,
    "--circle-gap": "4px",
  },

  "&:checked::after": {
    content: '" "',
    position: "absolute",
    width: "calc(100% - var(--circle-gap))",
    height: "calc(100% - var(--circle-gap))",
    left: "calc(var(--circle-gap) / 2)",
    top: "calc(var(--circle-gap) / 2)",
    background: "var(--circle-color)",
    borderRadius: 9999,
  },

  "&:checked:focus": {
    "--circle-gap": "4px",
    "--circle-color": theme.searchBarColor,
    borderColor: theme.searchBarColor,
    borderWidth: 2,
  },
});

const cssRadioContainer = css({
  label: "overlay-radio-container",
  display: "flex",
  flexDirection: "row",
  justifyContent: "baseline",
  paddingLeft: 10,
  paddingBottom: 10,
  backgroundColor: "rgb(105, 146, 176)",
});

export default AssetListOverlay;
