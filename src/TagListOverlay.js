/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

// TODO (2018-09-17) Brian Mock
// - Probably share some code with FloorOverlay eventually

import { h, Component } from "preact";
import PropTypes from "prop-types";
import groupBy from "lodash.groupby";

import IconSpinner from "./IconSpinner";
import Overlay from "./Overlay";
import OverlaySearchBar from "./OverlaySearchBar";
import { css, theme, mixins } from "./style";
import { createSearchMatcher, STRINGS, getTagLabels } from "./util";
import LabelList from "./LabelList";

const cssOverlayBuildingName = css({
  label: "overlay-building-name",
  top: 0,
  position: "sticky",
  textTransform: "uppercase",
  fontWeight: "bold",
  color: theme.brandBlue,
  background: theme.almostWhite,
  fontSize: theme.fontSizeSmaller,
  padding: 10
});

const cssTagList = css({
  label: "tags-list",
  overflowY: "auto",
  flex: "1 1 auto"
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
    textAlign: "left"
  }
);

const cssOverlayTagButtonInner = css(mixins.flexRow, {
  label: "overlay-tags-button-inner",
  alignItems: "center"
});

const cssOverlayTagButtonName = css({
  label: "overlay-tags-button-name",
  flex: "1 1 auto"
});

const cssTagListEmpty = css({
  label: "overlay-tags-list-empty",
  padding: "60px 20px",
  textAlign: "center",
  fontSize: theme.fontSizeBigger,
  color: theme.textColorBluish
});

class TagListOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFilter: ""
    };
    this.searchInput = null;
  }

  componentDidMount() {
    if (this.searchInput) {
      this.searchInput.focus();
    }
  }

  getFloorToGroup() {
    const { floors } = this.props;
    const floorToGroup = {};
    for (const floor of floors) {
      floorToGroup[floor.id] = [
        floor.group_name || STRINGS.unnamedBuilding,
        STRINGS.enDash,
        floor.name
      ].join(" ");
    }
    return floorToGroup;
  }

  getOrganizedTags(tags) {
    const floorToGroup = this.getFloorToGroup();
    return groupBy(tags, tag => {
      return floorToGroup[tag.map_id];
    });
  }

  getSortedGroups(organizedTags) {
    const { currentFloorID } = this.props;
    const groups = Object.keys(organizedTags).sort();
    groups.forEach((group, index) => {
      const floors = organizedTags[group];
      if (floors[0].map_id === currentFloorID) {
        const [currentGroup] = groups.splice(index, 1);
        groups.unshift(currentGroup);
      }
    });
    return groups;
  }

  renderTagList() {
    const {
      floors,
      updateMap,
      tagOptions,
      tags,
      loading,
      onMarkerClick,
      toggleTagListOverlay
    } = this.props;
    const { searchFilter } = this.state;
    if (loading) {
      return (
        <div className={cssTagListEmpty}>
          <IconSpinner />
        </div>
      );
    }
    const match = createSearchMatcher(searchFilter);
    const floorsByID = groupBy(floors, floor => floor.id);
    const processedTags = tags
      // Remove tags from unpublished floors
      .filter(tag => {
        const floor = floorsByID[tag.map_id][0];
        if (floor) {
          return floor.published;
        }
        return true;
      })
      // Remove tags that don't match the local search terms
      .filter(tag => {
        return (
          match(tag.name) || match(tag.mac) || getTagLabels(tag).some(match)
        );
      })
      // Remove control tags unless the developer wants them
      .filter(tag => {
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
    if (processedTags.length === 0) {
      return <div className={cssTagListEmpty}>{STRINGS.noResultsFound}</div>;
    }
    const organizedTags = this.getOrganizedTags(processedTags);
    const sortedGroups = this.getSortedGroups(organizedTags);
    return (
      <div className={cssTagList}>
        {sortedGroups.map(buildingName => (
          <div key={buildingName}>
            <div className={cssOverlayBuildingName}>{buildingName}</div>
            {organizedTags[buildingName].map(tag => (
              <button
                key={tag.id}
                data-testid={`meridian--private--overlay-tag-${tag.id}`}
                className={cssOverlayTagButton}
                onClick={() => {
                  updateMap({
                    locationID: tag.location_id,
                    floorID: tag.map_id,
                    tags: {
                      ...tagOptions,
                      filter: () => true
                    }
                  });
                  onMarkerClick(tag);
                  toggleTagListOverlay({ open: false });
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

  render() {
    const { searchFilter } = this.state;
    const { toggleTagListOverlay } = this.props;
    return (
      <Overlay
        position="right"
        onCloseClicked={() => {
          toggleTagListOverlay({ open: false });
        }}
      >
        <OverlaySearchBar
          value={searchFilter}
          onChange={searchFilter => {
            this.setState({ searchFilter });
          }}
        />
        {this.renderTagList()}
      </Overlay>
    );
  }
}

TagListOverlay.propTypes = {
  onMarkerClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  showControlTags: PropTypes.bool.isRequired,
  floors: PropTypes.array.isRequired,
  tagOptions: PropTypes.object.isRequired,
  updateMap: PropTypes.func.isRequired,
  api: PropTypes.object.isRequired,
  locationID: PropTypes.string.isRequired,
  currentFloorID: PropTypes.string.isRequired,
  toggleTagListOverlay: PropTypes.func.isRequired
};

export default TagListOverlay;
