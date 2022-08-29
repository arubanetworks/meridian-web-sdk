/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import groupBy from "lodash.groupby";
import { Component, createRef, Fragment, h } from "preact";
import IconSpinner from "./IconSpinner";
import LabelList from "./LabelList";
import Overlay from "./Overlay";
import OverlaySearchBar from "./OverlaySearchBar";
import { css, mixins, theme } from "./style";
import Translations from "./Translations";
import { createSearchMatcher, getTagLabels, uiText } from "./util";
import { CreateMapOptions, FloorData, PlacemarkData, TagData } from "./web-sdk";

type SearchType = "tags" | "placemarks";

interface AssetListOverlayProps {
  onTagClick: (tag: TagData) => void;
  onPlacemarkClick: (placemark: PlacemarkData) => void;
  tagsLoading: boolean;
  placemarksLoading: boolean;
  tags: TagData[];
  placemarks: PlacemarkData[];
  showControlTags: boolean;
  floors: FloorData[];
  tagOptions: CreateMapOptions["tags"];
  placemarkOptions: CreateMapOptions["placemarks"];
  updateMap: (options: Partial<CreateMapOptions>) => void;
  currentFloorID: string;
  toggleAssetListOverlay: (options: { open: boolean }) => void;
  showTags: boolean;
  showPlacemarks: boolean;
}

class AssetListOverlay extends Component<AssetListOverlayProps> {
  state: { searchFilter: string; searchType: SearchType } = {
    searchFilter: "",
    searchType: this.props.showTags ? "tags" : "placemarks",
  };
  searchInputRef = createRef<HTMLInputElement>();

  setRadioFilter = (filter: SearchType) => {
    this.setState({ searchType: filter });
  };

  componentDidMount() {
    if (this.searchInputRef.current) {
      this.searchInputRef.current.focus();
    }
  }

  render() {
    const {
      floors,
      tagsLoading,
      placemarksLoading,
      toggleAssetListOverlay,
      showTags,
      showPlacemarks,
    } = this.props;

    const SEARCH_TAGS = Translations.lookup("search_tags");
    const SEARCH_PLACEMARKS = Translations.lookup("search_placemarks");
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
          placeholder={
            this.state.searchType === "tags" ? SEARCH_TAGS : SEARCH_PLACEMARKS
          }
          value={searchFilter}
          onChange={(searchFilter) => {
            this.setState({ searchFilter });
          }}
        />

        <div className={cssRadioContainer(Boolean(showTags && showPlacemarks))}>
          {showTags ? (
            <Fragment>
              <input
                type="radio"
                name="searchType"
                id="tags"
                className={cssRadioButton}
                checked={this.state.searchType === "tags"}
                onChange={(event: any) => {
                  if (event.target.checked) {
                    this.setRadioFilter("tags");
                  }
                }}
              />
              <label for="tags" className={cssRadioButtonLabel}>
                Tags
              </label>
            </Fragment>
          ) : null}
          {showPlacemarks ? (
            <Fragment>
              <input
                type="radio"
                name="searchType"
                id="placemarks"
                className={cssRadioButton}
                checked={this.state.searchType === "placemarks"}
                onChange={(event: any) => {
                  if (event.target.checked) {
                    this.setRadioFilter("placemarks");
                  }
                }}
              />
              <label for="placemarks" className={cssRadioButtonLabel}>
                Placemarks
              </label>
            </Fragment>
          ) : null}
        </div>

        {(() => {
          if (this.state.searchType === "tags") {
            return (
              <TagResults
                {...this.props}
                floorToGroup={floorToGroup}
                floorsByID={floorsByID}
                match={match}
                loading={tagsLoading}
              />
            );
          }
          return (
            <PlacemarkResults
              {...this.props}
              floorToGroup={floorToGroup}
              floorsByID={floorsByID}
              match={match}
              loading={placemarksLoading}
            />
          );
        })()}
      </Overlay>
    );
  }
}

interface TagResultsProps extends AssetListOverlayProps {
  floorToGroup: Record<string, string>;
  floorsByID: Record<string, any>;
  match: (target: string) => boolean;
  loading: boolean;
}

function TagResults(props: TagResultsProps) {
  const {
    currentFloorID,
    updateMap,
    tagOptions = {},
    tags,
    loading,
    onTagClick,
    toggleAssetListOverlay,
    match,
    floorsByID,
    floorToGroup,
  } = props;

  const filteredTags = tags
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
      return (
        match(tag.name || "") || match(tag.mac) || getTagLabels(tag).some(match)
      );
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

  const organizedTags = groupBy(filteredTags, (tag) => {
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

  if (loading) {
    return (
      <div className={cssAssetListEmpty}>
        <IconSpinner />
      </div>
    );
  }

  if (filteredTags.length === 0) {
    return <div className={cssAssetListEmpty}>{uiText.noResultsFound}</div>;
  }

  return (
    <div className={cssAssetList}>
      {sortedGroups.map((buildingName) => (
        <div key={buildingName}>
          <div className={cssOverlayBuildingName}>{buildingName}</div>
          {organizedTags[buildingName].map((tag) => (
            <button
              key={tag.id}
              data-testid={`meridian--private--overlay-tag-${tag.id}`}
              className={cssOverlayAssetButton}
              onClick={() => {
                updateMap({
                  floorID: tag.map_id,
                  tags: { ...tagOptions, filter: () => true },
                });
                onTagClick(tag);
                toggleAssetListOverlay({ open: false });
              }}
            >
              <div className={cssOverlayAssetButtonInner}>
                <div className={cssOverlayAssetButtonName}>
                  {tag.name || tag.mac}
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
}

interface PlacemarkResultsProps extends AssetListOverlayProps {
  floorToGroup: Record<string, string>;
  floorsByID: Record<string, any>;
  match: (target: string) => boolean;
  loading: boolean;
}

function PlacemarkResults(props: PlacemarkResultsProps) {
  const {
    currentFloorID,
    updateMap,
    placemarkOptions = {},
    toggleAssetListOverlay,
    floorToGroup,
    match,
    placemarks,
    onPlacemarkClick,
    floorsByID,
    loading,
  } = props;

  const filteredPlacemarks = placemarks
    // Remove placemarks from unpublished floors
    .filter((placemark: PlacemarkData) => {
      const floor = floorsByID[placemark.map][0];
      if (floor) {
        return floor.published;
      }
      return true;
    })
    // Remove placemarks that don't match the local search terms
    .filter((placemark: PlacemarkData) => {
      return match(placemark.name || "") || match(placemark.type_name || "");
    })
    .filter((placemark: PlacemarkData) => {
      if (placemark.type === "exclusion_area") {
        return false;
      }
      if (placemarkOptions.showHiddenPlacemarks !== true) {
        return !placemark.hide_on_map;
      }
      return true;
    })
    // Sort by name
    .sort((a: PlacemarkData, b: PlacemarkData) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

  const organizedPlacemarks = groupBy(filteredPlacemarks, (placemark) => {
    return floorToGroup[placemark.map];
  });

  const sortedGroups = Object.keys(organizedPlacemarks).sort();

  sortedGroups.forEach((group, index) => {
    const floors = organizedPlacemarks[group];
    if (floors[0].map_id === currentFloorID) {
      const [currentGroup] = sortedGroups.splice(index, 1);
      sortedGroups.unshift(currentGroup);
    }
  });

  if (loading) {
    return (
      <div className={cssAssetListEmpty}>
        <IconSpinner />
      </div>
    );
  }

  if (filteredPlacemarks.length === 0) {
    return <div className={cssAssetListEmpty}>{uiText.noResultsFound}</div>;
  }

  return (
    <div className={cssAssetList}>
      {sortedGroups.map((buildingName) => (
        <div key={buildingName}>
          <div className={cssOverlayBuildingName}>{buildingName}</div>
          {organizedPlacemarks[buildingName].map((placemark: PlacemarkData) => (
            <button
              key={placemark.id}
              data-testid={`meridian--private--overlay-tag-${placemark.id}`}
              className={cssOverlayAssetButton}
              onClick={() => {
                updateMap({
                  floorID: placemark.map,
                  placemarks: { ...placemarkOptions, filter: () => true },
                });
                onPlacemarkClick(placemark);
                toggleAssetListOverlay({ open: false });
              }}
            >
              <div className={cssOverlayAssetButtonName}>
                {placemark.name || placemark.type_name}
              </div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
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

const cssAssetList = css({
  label: "asset-list",
  overflowY: "auto",
  flex: "1 1 auto",
});

const cssOverlayAssetButton = css(
  mixins.buttonReset,
  mixins.focusRingMenuItem,
  mixins.buttonHoverActive,
  {
    label: "overlay-asset-button",
    minHeight: 56,
    padding: 10,
    paddingLeft: 20,
    display: "block",
    width: "100%",
    textAlign: "left",
  }
);

const cssOverlayAssetButtonInner = css(mixins.flexRow, {
  label: "overlay-asset-button-inner",
  alignItems: "center",
});

const cssOverlayAssetButtonName = css({
  label: "overlay-asset-button-name",
  flex: "1 1 auto",
});

const cssAssetListEmpty = css({
  label: "overlay-asset-list-empty",
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

const cssRadioContainer = (show: boolean) => {
  return css({
    label: "overlay-radio-container",
    display: show ? "flex" : "none",
    flexDirection: "row",
    justifyContent: "baseline",
    paddingLeft: 10,
    paddingBottom: 10,
    backgroundColor: "rgb(105, 146, 176)",
    alignItems: "center",
  });
};

export default AssetListOverlay;
