// TODO:
// - This code is copy/pasted from FloorOverlay! Fix the variable names
// - Add CSS hook classes
// - Probably share some code with FloorOverlay eventually

import { h, Component } from "preact";
import PropTypes from "prop-types";
import groupBy from "lodash.groupby";
import keyBy from "lodash.keyby";
import throttle from "lodash.throttle";

import IconSpinner from "./IconSpinner";
import Overlay from "./Overlay";
import OverlaySearchBar from "./OverlaySearchBar";
import { css, theme, mixins, cx } from "./style";
import { doesSearchMatch, fetchAllTags, normalizeTag } from "./util";
import { STREAM_ALL_FLOORS } from "./API";
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
    minHeight: 60,
    padding: 10,
    paddingLeft: 20,
    display: "block",
    width: "100%",
    textAlign: "left"
  }
);

const cssTagListEmpty = css({
  label: "overlay-tags-list-empty",
  padding: "60px 20px",
  textAlign: "center",
  fontSize: theme.fontSizeBigger,
  color: theme.textColorBluish
});

// TODO: Cache the results for 5 minutes, I guess, since it's slow
const throttledFetchAllTags = throttle(fetchAllTags, 5 * 60 * 1000);

class TagListOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFilter: "",
      loading: true,
      tags: null
    };
    this.searchInput = null;
  }

  componentDidMount() {
    if (this.searchInput) {
      this.searchInput.focus();
    }
    this.loadTags();
  }

  async loadTags() {
    const { api, locationID, showControlTags } = this.props;
    const floorID = STREAM_ALL_FLOORS;
    const rawTags = await throttledFetchAllTags({ api, locationID, floorID });
    const normalizedTags = rawTags
      .map(normalizeTag)
      .filter(tag => showControlTags === true || !tag.isControlTag);
    this.setState({ tags: normalizedTags, loading: false });
  }

  getFloorToBuilding() {
    const { floors } = this.props;
    const floorToBuilding = {};
    for (const floor of floors) {
      floorToBuilding[floor.id] = floor.group_name;
    }
    return floorToBuilding;
  }

  getOrganizedTags(tags) {
    const floorToBuilding = this.getFloorToBuilding();
    const organizedTags = groupBy(tags, tag => floorToBuilding[tag.floorID]);
    // TODO: Sort the tags within here by level
    return organizedTags;
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
    return floors.filter(floor => {
      return (
        doesSearchMatch(searchFilter, floor.name || "") ||
        doesSearchMatch(searchFilter, floor.group_name || "Unassigned")
      );
    });
  }

  getSortedBuildingNames(organizedTags) {
    // TODO: Sort the current floor above all the others
    return Object.keys(organizedTags);
  }

  renderTagList() {
    const { update, tagOptions } = this.props;
    const { searchFilter, loading, tags } = this.state;
    if (loading) {
      return (
        <div className={cssTagListEmpty}>
          <IconSpinner />
        </div>
      );
    }
    // TODO: Actually search the tags list
    const processedTags = tags
      .filter(tag => {
        const match = x => doesSearchMatch(searchFilter, x);
        return match(tag.name) || tag.labels.some(match);
      })
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    const organizedTags = this.getOrganizedTags(processedTags);
    const sortedBuildingNames = this.getSortedBuildingNames(organizedTags);
    return (
      // TODO: We need an empty state here for when the search filter is bad
      <div className={cssTagList}>
        {sortedBuildingNames.map(buildingName => (
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
                }}
              >
                <div>{tag.name}</div>
                <LabelList labels={tag.labels || []} />
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
