import { h, Component } from "preact";
import PropTypes from "prop-types";
import groupBy from "lodash.groupby";

import Overlay from "./Overlay";
import OverlaySearchBar from "./OverlaySearchBar";
import { css, theme, mixins, cx } from "./style";
import { createSearchMatcher, STRINGS } from "./util";

const cssOverlayBuildingName = css({
  label: "overlay-building-name",
  textTransform: "uppercase",
  fontWeight: "bold",
  top: 0,
  position: "sticky",
  color: theme.brandBlue,
  background: theme.almostWhite,
  fontSize: theme.fontSizeSmaller,
  padding: 10
});

const cssFloorsList = css({
  label: "floors-list",
  overflowY: "auto"
});

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

const cssFloorCheckmark = css({
  label: "floor-checkmark",
  verticalAlign: "middle",
  marginLeft: "0.5em",
  width: "0.8em",
  height: "0.8em"
});

const FloorCheckmark = () => (
  <svg
    viewBox="0 0 10 7"
    className={cx(
      "meridian-overlay-current-floor-checkmark",
      cssFloorCheckmark
    )}
  >
    <path d="M3.9 7C3.7 7 3.4 6.9 3.2 6.7L0.3 3.8C-0.1 3.4 -0.1 2.8 0.3 2.4C0.7 2 1.3 2 1.7 2.4L3.9 4.6L8.2 0.3C8.6 -0.1 9.2 -0.1 9.6 0.3C10 0.7 10 1.3 9.6 1.7L4.6 6.7C4.4 6.9 4.2 7 3.9 7Z" />
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
    const { floors } = this.props;
    const match = createSearchMatcher(searchFilter);
    return floors.filter(
      floor =>
        match(floor.name || "") ||
        match(floor.group_name || STRINGS.unnamedBuilding)
    );
  }

  renderList() {
    const { currentFloorID, toggleFloorOverlay, selectFloorByID } = this.props;
    // TODO: Put "Unassigned" at the bottom of the results
    const floors = this.processedFloorsByBuilding();
    const groupedFloors = groupBy(floors, "group_name");
    // TODO: Put "" at the bottom
    const buildingNames = Object.keys(groupedFloors).sort();
    if (buildingNames[0] === "") {
      buildingNames.push(buildingNames.shift());
    }
    for (const name of buildingNames) {
      groupedFloors[name].sort((a, b) => a.level - b.level);
    }
    if (buildingNames.length > 0) {
      return (
        <div className={cx("meridian-overlay-floor-list", cssFloorsList)}>
          {buildingNames.map(buildingName => (
            <div key={buildingName}>
              <div
                className={cx(
                  "meridian-overlay-building-name",
                  cssOverlayBuildingName
                )}
              >
                {buildingName || STRINGS.unnamedBuilding}
              </div>
              {groupedFloors[buildingName].map(floor => (
                <button
                  key={floor.name}
                  onClick={() => {
                    selectFloorByID(floor.id);
                    toggleFloorOverlay({ open: false });
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
        className={cx("meridian-overlay-floor-list-empty", cssFloorsListEmpty)}
      >
        {STRINGS.noResultsFound}
      </div>
    );
  }

  render() {
    const { searchFilter } = this.state;
    const { toggleFloorOverlay } = this.props;
    return (
      <Overlay
        position="right"
        onCloseClicked={() => {
          toggleFloorOverlay({ open: false });
        }}
      >
        <OverlaySearchBar
          value={searchFilter}
          onChange={searchFilter => {
            this.setState({ searchFilter });
          }}
        />
        {this.renderList()}
      </Overlay>
    );
  }
}

FloorOverlay.propTypes = {
  toggleFloorOverlay: PropTypes.func.isRequired,
  currentFloorID: PropTypes.string.isRequired,
  floors: PropTypes.object.isRequired,
  selectFloorByID: PropTypes.func.isRequired,
  closeFloorOverlay: PropTypes.func.isRequired
};

export default FloorOverlay;
