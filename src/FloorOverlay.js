import { h, Component } from "preact";
import PropTypes from "prop-types";
import groupBy from "lodash.groupby";

import Overlay from "./Overlay";
import { css, theme, mixins, cx } from "./style";
import { doesSearchMatch, ungroup } from "./util";

const cssOverlayBuildingName = css({
  label: "overlay-building-name",
  textTransform: "uppercase",
  fontWeight: "bold",
  color: theme.brandBlue,
  borderTop: `1px solid ${theme.borderColor}`,
  fontSize: theme.fontSizeSmaller,
  padding: 10
});

const cssFloorsList = css({
  label: "floors-list",
  overflowY: "auto",
  paddingBottom: 10,
  flex: "1 1 auto"
});

const cssSearchBar = css({
  label: "overlay-search-bar",
  boxShadow: `0 1px 0 ${theme.borderColor}`,
  zIndex: 1,
  flex: "0 0 auto",
  display: "flex",
  flexDirection: "column",
  padding: 10,
  height: 32
});

const cssSearchInput = css(
  mixins.buttonReset,
  mixins.rounded,
  mixins.focusRing,
  {
    label: "overlay-search-input",
    flex: "1 1 auto",
    marginRight: 32 + 10,
    padding: "4px 8px",
    background: theme.borderColor,
    border: 0,
    "&::placeholder": {
      color: theme.textColorBluish
    }
  }
);

const cssOverlayFloorButton = css(
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

const cssFloorsListEmpty = css({
  label: "overlay-floor-list-empty",
  padding: "60px 20px",
  textAlign: "center",
  fontSize: theme.fontSizeBigger,
  color: theme.textColorBluish
});

const cssOverlayCurrentFloor = css({
  label: "overlay-floor-button-curent-floor",
  color: theme.brandBrightBlue,
  fill: "currentcolor"
});

const FloorCheckmark = () => (
  <svg width="36" height="36" viewBox="0 0 36 36">
    <path d="M16.94 21.52a1 1 0 0 1-.71-.29l-2.91-2.91a1 1 0 1 1 1.41-1.41l2.21 2.2 4.33-4.33a1 1 0 1 1 1.41 1.41l-5 5a1 1 0 0 1-.71.29" />
  </svg>
);

class FloorOverlay extends Component {
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

  handleSearchFilterChange = event => {
    this.setState({ searchFilter: event.target.value });
  };

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

  renderList() {
    const { currentFloorID, closeFloorOverlay, selectFloorByID } = this.props;
    // TODO: Put "Unassigned" at the bottom of the results
    const floors = this.processedFloorsByBuilding();
    const groupedFloors = groupBy(floors, "group_name");
    // TODO: Put "" at the bottom
    const buildingNames = Object.keys(groupedFloors).sort();
    if (buildingNames[0] === "") {
      buildingNames.push(buildingNames.shift());
    }
    if (buildingNames.length > 0) {
      return (
        <div className={cx(cssFloorsList, "meridian-overlay-floor-list")}>
          {buildingNames.map(buildingName => (
            <div key={buildingName}>
              <div
                className={cx(
                  cssOverlayBuildingName,
                  "meridian-overlay-building-name"
                )}
              >
                {buildingName || "Unassigned"}
              </div>
              {groupedFloors[buildingName].map(floor => (
                <button
                  key={floor.name}
                  onClick={() => {
                    selectFloorByID(floor.id);
                    closeFloorOverlay();
                  }}
                  className={cx(
                    cssOverlayFloorButton,
                    floor.id === currentFloorID && [
                      cssOverlayCurrentFloor,
                      "meridian-overlay-floor-button-curent-floor"
                    ],
                    "meridian-overlay-floor-button"
                  )}
                >
                  {floor.name}
                  {floor.id === currentFloorID ? <FloorCheckmark /> : null}
                </button>
              ))}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div
        className={cx(cssFloorsListEmpty, "meridian-overlay-floor-list-empty")}
      >
        No results found.
      </div>
    );
  }

  render() {
    const { searchFilter } = this.state;
    const { closeFloorOverlay } = this.props;
    return (
      <Overlay position="right" onCloseClicked={closeFloorOverlay}>
        <div className={cx(cssSearchBar, "meridian-overlay-search-bar")}>
          <input
            ref={element => {
              this.searchInput = element;
            }}
            value={searchFilter}
            onInput={this.handleSearchFilterChange}
            type="text"
            placeholder="Search"
            className={cx(cssSearchInput, "meridian-overlay-search-input")}
          />
        </div>
        {this.renderList()}
      </Overlay>
    );
  }
}

FloorOverlay.propTypes = {
  currentFloorID: PropTypes.string.isRequired,
  floorsByBuilding: PropTypes.object.isRequired,
  selectFloorByID: PropTypes.func.isRequired,
  closeFloorOverlay: PropTypes.func.isRequired
};

export default FloorOverlay;
