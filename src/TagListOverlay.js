// TODO: This code is copy/pasted from FloorOverlay! Fix the variable names

import { h, Component } from "preact";
import PropTypes from "prop-types";
import groupBy from "lodash.groupby";
import keyBy from "lodash.keyby";

import Overlay from "./Overlay";
import OverlaySearchBar from "./OverlaySearchBar";
import { css, theme, mixins, cx } from "./style";
import { doesSearchMatch, ungroup, fetchAllTags, normalizeTag } from "./util";
import { STREAM_ALL_FLOORS } from "./API";

const cssOverlayBuildingName = css({
  label: "overlay-building-name",
  textTransform: "uppercase",
  fontWeight: "bold",
  color: theme.brandBlue,
  borderTop: `1px solid ${theme.borderColor}`,
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
    label: "overlay-floor-button",
    padding: 10,
    paddingLeft: 20,
    display: "block",
    width: "100%",
    textAlign: "left"
  }
);

const cssTagListEmpty = css({
  label: "overlay-floor-list-empty",
  padding: "60px 20px",
  textAlign: "center",
  fontSize: theme.fontSizeBigger,
  color: theme.textColorBluish
});

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
    const { api, locationID } = this.props;
    const floorID = STREAM_ALL_FLOORS;
    const rawTags = await fetchAllTags({ api, locationID, floorID });
    const normalizedTags = rawTags.map(normalizeTag);
    this.setState({ tags: normalizedTags, loading: false });
  }

  getFloorToBuilding() {
    const { floorsByBuilding } = this.props;
    const floorToBuilding = {};
    for (const floor of ungroup(floorsByBuilding)) {
      floorToBuilding[floor.id] = floor.group_name;
    }
    return floorToBuilding;
  }

  getOrganizedTags(tags) {
    const floorToBuilding = this.getFloorToBuilding();
    const organizedTags = groupBy(tags, tag => floorToBuilding[tag.floorID]);
    // TODO: Sort the tags within here by level
    console.log({ tags });
    console.log({ floorToBuilding });
    console.log({ organizedTags });
    return organizedTags;
  }

  handleSearchFilterChange = event => {
    this.setState({ searchFilter: event.target.value });
  };

  getFloorsByID() {
    const { floorsByBuilding } = this.props;
    return keyBy(ungroup(floorsByBuilding), "id");
  }

  // Move "" to the end of the list (Unassigned)
  processedFloorsByBuilding() {
    const { searchFilter } = this.state;
    const { floorsByBuilding } = this.props;
    return ungroup(floorsByBuilding).filter(floor => {
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
      return <div className={cssTagListEmpty}>Loading...</div>;
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
      <div className={cssTagList}>
        {sortedBuildingNames.map(buildingName => (
          <div key={buildingName}>
            <div className={cssOverlayBuildingName}>{buildingName}</div>
            {organizedTags[buildingName].map(tag => (
              <button
                key={tag.id}
                className={cssOverlayTagButton}
                onClick={() => {
                  // TODO: We should stop using objects in the props since they
                  // don't merge cleanly... It's such a pain
                  update({
                    tags: {
                      ...tagOptions,
                      all: false,
                      labels: [],
                      ids: [tag.id]
                    }
                  });
                }}
              >
                <div>{tag.name}</div>
                <div style={{ opacity: 0.6 }}>
                  {tag.labels.join(" • ") || "."}
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
    const { closeTagListOverlay } = this.props;
    return (
      <Overlay position="right" onCloseClicked={closeTagListOverlay}>
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
  floorsByBuilding: PropTypes.object.isRequired,
  tagOptions: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  api: PropTypes.object.isRequired,
  locationID: PropTypes.string.isRequired,
  currentFloorID: PropTypes.string.isRequired,
  closeTagListOverlay: PropTypes.func.isRequired
};

export default TagListOverlay;
