/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import groupBy from "lodash.groupby";
import { Component, createRef, h } from "preact";
import Overlay from "./Overlay";
import OverlaySearchBar from "./OverlaySearchBar";
import { css, cx, mixins, theme } from "./style";
import Translations from "./Translations";
import { createSearchMatcher, uiText } from "./util";
import { FloorData } from "./web-sdk";

export interface FloorOverlayProps {
  toggleFloorOverlay: (options: { open: boolean }) => void;
  currentFloorID: string;
  floors: FloorData[];
  selectFloorByID: (floorID: string) => void;
}

class FloorOverlay extends Component<FloorOverlayProps> {
  state = { searchFilter: "" };
  searchInputRef = createRef<HTMLInputElement>();

  componentDidMount() {
    if (this.searchInputRef.current) {
      this.searchInputRef.current.focus();
    }
  }

  render() {
    const SEARCH_FLOORS = Translations.lookup("search_floors");
    const { currentFloorID, toggleFloorOverlay, selectFloorByID, floors } =
      this.props;
    const { searchFilter } = this.state;
    const match = createSearchMatcher(searchFilter);
    const processedFloors = floors.filter((floor) => {
      return (
        floor.published &&
        (match(floor.name || "") ||
          match(floor.group_name || uiText.unnamedBuilding))
      );
    });
    const groupedFloors = groupBy(processedFloors, "group_name");
    const buildingNames = Object.keys(groupedFloors).sort();
    if (buildingNames[0] === "") {
      buildingNames.push(buildingNames[0]);
      buildingNames.shift();
    }
    for (const name of buildingNames) {
      groupedFloors[name].sort((a, b) => Math.sign(a.level - b.level));
    }
    return (
      <Overlay
        position="right"
        onCloseClicked={() => {
          toggleFloorOverlay({ open: false });
        }}
      >
        <OverlaySearchBar
          placeholder={SEARCH_FLOORS}
          value={searchFilter}
          onChange={(searchFilter) => {
            this.setState({ searchFilter });
          }}
        />
        {buildingNames.length === 0 ? (
          <div className={cssFloorsListEmpty}>{uiText.noResultsFound}</div>
        ) : (
          <div
            className={cssFloorsList}
            data-testid="meridian--private--floors-list"
          >
            {buildingNames.map((buildingName) => (
              <div key={buildingName}>
                <div className={cssOverlayBuildingName}>
                  {buildingName || uiText.unnamedBuilding}
                </div>
                {groupedFloors[buildingName].map((floor) => (
                  <button
                    key={floor.name}
                    onClick={() => {
                      selectFloorByID(floor.id);
                      toggleFloorOverlay({ open: false });
                    }}
                    className={cx(
                      cssOverlayFloorButton,
                      floor.id === currentFloorID
                        ? cssOverlayCurrentFloor
                        : undefined
                    )}
                    data-testid={
                      floor.id === currentFloorID
                        ? "meridian--private--current-floor"
                        : "meridian--private--floor"
                    }
                  >
                    {floor.name}
                    {floor.id === currentFloorID ? (
                      <svg viewBox="0 0 10 7" className={cssFloorCheckmark}>
                        <path d="M3.9 7C3.7 7 3.4 6.9 3.2 6.7L0.3 3.8C-0.1 3.4 -0.1 2.8 0.3 2.4C0.7 2 1.3 2 1.7 2.4L3.9 4.6L8.2 0.3C8.6 -0.1 9.2 -0.1 9.6 0.3C10 0.7 10 1.3 9.6 1.7L4.6 6.7C4.4 6.9 4.2 7 3.9 7Z" />
                      </svg>
                    ) : null}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </Overlay>
    );
  }
}

const cssOverlayBuildingName = css({
  label: "overlay-building-name",
  textTransform: "uppercase",
  fontWeight: "bold",
  top: 0,
  position: "sticky",
  color: theme.brandBlue,
  background: theme.almostWhite,
  fontSize: theme.fontSizeSmaller,
  padding: 10,
});

const cssFloorsList = css({
  label: "floors-list",
  overflowY: "auto",
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
    textAlign: "left",
  }
);

const cssFloorsListEmpty = css({
  label: "overlay-floor-list-empty",
  padding: "60px 20px",
  textAlign: "center",
  fontSize: theme.fontSizeBigger,
  color: theme.textColorBluish,
});

const cssOverlayCurrentFloor = css({
  label: "overlay-floor-button-curent-floor",
  color: theme.brandBrightBlue,
  fill: "currentcolor",
});

const cssFloorCheckmark = css({
  label: "floor-checkmark",
  verticalAlign: "middle",
  marginLeft: "0.5em",
  width: "0.8em",
  height: "0.8em",
});

export default FloorOverlay;
