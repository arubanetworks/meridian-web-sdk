import { h } from "preact";
import PropTypes from "prop-types";

import Overlay from "./Overlay";
import { css, theme, mixins, cx } from "./style";

const cssOverlayBuildingName = css({
  label: "overlay-building-name",
  textTransform: "uppercase",
  fontWeight: "bold",
  color: theme.brandBlue,
  borderTop: `1px solid ${theme.borderColor}`,
  fontSize: theme.fontSizeSmaller,
  padding: 10,
  paddingTop: 15,
  paddingBottom: 5
});

const cssFloorsList = css({
  overflowY: "auto",
  flex: "1 1 auto"
});

const cssSearchBar = css({
  label: "overlay-search-bar",
  boxShadow: `0 1px 0 ${theme.borderColor}`,
  flex: "0 0 auto",
  display: "flex",
  flexDirection: "column",
  padding: 10,
  height: 32
});

const cssSearchInput = css(
  mixins.buttonReset,
  mixins.rounded,
  mixins.focusOutline,
  {
    label: "overlay-search-input",
    flex: "1 1 auto",
    marginRight: 32 + 10,
    padding: "4px 8px",
    background: theme.borderColor,
    border: 0
  }
);

const cssOverlayFloorButton = css(mixins.buttonReset, mixins.focusDarken, {
  label: "overlay-floor-button",
  padding: 10,
  display: "block",
  width: "100%",
  textAlign: "left",
  "&:hover": {
    background: theme.buttonHoverColor
  }
});

const cssOverlayCurrentFloor = css({
  label: "overlay-floor-button-curent-floor",
  fontWeight: "bold"
});

// Move "" to the end of the list (Unassigned)
const sortedBuildingNames = floorsByBuilding => {
  const keys = Object.keys(floorsByBuilding).sort();
  if (keys[0] === "") {
    keys.push(keys.shift());
  }
  return keys;
};

const FloorOverlay = ({
  currentFloorID,
  floorsByBuilding,
  closeFloorOverlay,
  selectFloorByID
}) => (
  <Overlay position="right" onCloseClicked={closeFloorOverlay}>
    <div className={cx(cssSearchBar, "meridian-overlay-search-bar")}>
      <input
        autoFocus
        type="text"
        placeholder="Search"
        className={cx(cssSearchInput, "meridian-overlay-search-input")}
      />
    </div>
    <div className={cx(cssFloorsList, "meridian-overlay-floor-list")}>
      {sortedBuildingNames(floorsByBuilding).map(buildingName => (
        <div key={buildingName}>
          <div
            className={cx(
              cssOverlayBuildingName,
              "meridian-overlay-building-name"
            )}
          >
            {buildingName || "Unassigned"}
          </div>
          {floorsByBuilding[buildingName].map(floor => (
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
              {floor.id === currentFloorID ? " ✓" : null}
            </button>
          ))}
        </div>
      ))}
    </div>
  </Overlay>
);

FloorOverlay.propTypes = {
  currentFloorID: PropTypes.string.isRequired,
  floorsByBuilding: PropTypes.object.isRequired,
  selectFloorByID: PropTypes.func.isRequired,
  closeFloorOverlay: PropTypes.func.isRequired
};

export default FloorOverlay;
