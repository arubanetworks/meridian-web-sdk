import { h, Component } from "preact";
import PropTypes from "prop-types";
import groupBy from "lodash.groupby";

import Overlay from "./Overlay";
import OverlaySearchBar from "./OverlaySearchBar";
import { css, theme, mixins, cx } from "./style";
import { doesSearchMatch, ungroup, fetchAllPaginatedData } from "./util";

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
      cssFloorCheckmark,
      "meridian-overlay-current-floor-checkmark"
    )}
  >
    <path d="M3.9 7C3.7 7 3.4 6.9 3.2 6.7L0.3 3.8C-0.1 3.4 -0.1 2.8 0.3 2.4C0.7 2 1.3 2 1.7 2.4L3.9 4.6L8.2 0.3C8.6 -0.1 9.2 -0.1 9.6 0.3C10 0.7 10 1.3 9.6 1.7L4.6 6.7C4.4 6.9 4.2 7 3.9 7Z" />
  </svg>
);

class FloorOverlay extends Component {
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
    const url = `locations/${locationID}/asset-beacons`;
    const tags = await fetchAllPaginatedData(api, url);
    this.setState({ tags, loading: false });
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
    const { searchFilter, loading } = this.state;
    const { closeTagListOverlay } = this.props;
    return (
      <Overlay position="right" onCloseClicked={closeTagListOverlay}>
        <OverlaySearchBar
          value={searchFilter}
          onChange={searchFilter => {
            this.setState({ searchFilter });
          }}
        />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <pre className={cssFloorsList}>
            {JSON.stringify(this.state.tags, null, 2)}
          </pre>
        )}
      </Overlay>
    );
  }
}

FloorOverlay.propTypes = {
  api: PropTypes.object.isRequired,
  locationID: PropTypes.string.isRequired,
  currentFloorID: PropTypes.string.isRequired,
  closeTagListOverlay: PropTypes.func.isRequired
};

export default FloorOverlay;
