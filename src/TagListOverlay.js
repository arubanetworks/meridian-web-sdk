// TODO:
// - This code is copy/pasted from FloorOverlay! Fix the variable names
// - Add CSS hook classes
// - Probably share some code with FloorOverlay eventually

import { h, Component } from "preact";
import PropTypes from "prop-types";
import groupBy from "lodash.groupby";
import keyBy from "lodash.keyby";

import IconSpinner from "./IconSpinner";
import Overlay from "./Overlay";
import OverlaySearchBar from "./OverlaySearchBar";
import { css, theme, mixins, cx } from "./style";
import { createSearchMatcher, STRINGS } from "./util";
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
  label: "floors-list",
  overflowY: "auto",
  flex: "1 1 auto"
});

const cssOverlayTagButton = css(
  mixins.buttonReset,
  mixins.focusRingMenuItem,
  mixins.buttonHoverActive,
  {
    label: "overlay-tags-button",
    minHeight: 52,
    padding: 10,
    paddingLeft: 20,
    display: "block",
    width: "100%",
    textAlign: "left"
  }
);

const cssOverlayTagButtonInner = css(mixins.flexRow, {
  label: "overlay-tags-button-inner"
});

const cssOverlayTagButtonName = css({
  label: "overlay-tags-button-name",
  flex: "1 0 auto"
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
        floor.group_name,
        STRINGS.enDash,
        floor.name
      ].join(" ");
    }
    return floorToGroup;
  }

  getOrganizedTags(tags) {
    const floorToGroup = this.getFloorToGroup();
    return groupBy(tags, tag => floorToGroup[tag.floorID]);
  }

  handleSearchFilterChange = event => {
    this.setState({ searchFilter: event.target.value });
  };

  getFloorsByID() {
    const { floors } = this.props;
    return keyBy(floors, "id");
  }

  // Move "" to the end of the list (Unassigned)
  processedFloorsByBuilding() {
    const { searchFilter } = this.state;
    const { floors } = this.props;
    const match = createSearchMatcher(searchFilter);
    return floors.filter(
      floor =>
        match(floor.name || "") ||
        match(floor.group_name || STRINGS.unnamedBuilding)
    );
  }

  getSortedGroups(organizedTags) {
    // TODO: Sort the current floor above all the others
    return Object.keys(organizedTags).sort();
  }

  renderTagList() {
    const { update, tagOptions, tags, loading, onMarkerClick } = this.props;
    const { searchFilter } = this.state;
    if (loading) {
      return (
        <div className={cssTagListEmpty}>
          <IconSpinner />
        </div>
      );
    }
    const match = createSearchMatcher(searchFilter);
    const processedTags = tags
      .filter(tag => match(tag.name) || tag.labels.some(match))
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
                className={cssOverlayTagButton}
                onClick={() => {
                  update({
                    locationID: tag.locationID,
                    floorID: tag.floorID,
                    tags: {
                      ...tagOptions,
                      filter: t => t.id === tag.id
                    }
                  });
                  onMarkerClick(tag);
                }}
              >
                <div className={cssOverlayTagButtonInner}>
                  <div className={cssOverlayTagButtonName}>{tag.name}</div>
                  <LabelList align="right" labels={tag.labels || []} />
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
  floors: PropTypes.object.isRequired,
  tagOptions: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  api: PropTypes.object.isRequired,
  locationID: PropTypes.string.isRequired,
  currentFloorID: PropTypes.string.isRequired,
  toggleTagListOverlay: PropTypes.func.isRequired
};

export default TagListOverlay;
