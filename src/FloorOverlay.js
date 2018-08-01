import { h } from "preact";
import PropTypes from "prop-types";

import Overlay from "./Overlay";
import { css, theme, mixins, cx } from "./style";

const cssOverlayBuildingName = css({
  label: "overlay-building-name",
  textTransform: "uppercase",
  fontWeight: "bold",
  color: theme.brandBlue,
  fontSize: theme.fontSizeSmaller,
  padding: 20,
  paddingBottom: 10
});

const cssFloorsList = css({
  overflowY: "auto"
});

const cssOverlayFloorButton = css({
  label: "overlay-floor-button",
  ...mixins.buttonReset,
  ...mixins.focusDarken,
  padding: 20,
  borderBottom: `1px solid ${theme.borderColor}`,
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
  <Overlay location="right" onCloseClicked={closeFloorOverlay}>
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
