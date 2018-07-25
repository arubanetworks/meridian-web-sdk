import { h } from "preact";
import PropTypes from "prop-types";

import { css, theme, mixins, cx } from "./style";

const cssOverlay = css({
  label: "overlay",
  ...mixins.shadow,
  ...mixins.rounded,
  ...mixins.fontSize,
  overflow: "hidden",
  background: theme.white,
  color: theme.textColor,
  fill: "#000",
  position: "absolute",
  marginLeft: "auto",
  maxWidth: 500,
  left: 10,
  top: 10,
  bottom: 10,
  right: 10,
  zIndex: 2
});

const cssOverlayContent = css({
  label: "overlay-content",
  ...mixins.borderBox,
  width: "100%",
  height: "100%",
  padding: 16,
  overflowY: "auto"
});

const cssOverlayBuildingName = css({
  label: "overlay-building-name",
  fontWeight: "bold",
  padding: 10,
  marginBottom: 10,
  borderBottom: `1px solid ${theme.borderColor}`
});

const cssOverlayFloorButton = css({
  label: "overlay-floor-button",
  ...mixins.buttonReset,
  ...mixins.focusDarken,
  ...mixins.rounded,
  color: theme.brandBrightBlue,
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: 10,
  "&:hover": {
    background: theme.buttonHoverColor
  }
});

const cssOverlayCurrentFloor = css({
  label: "overlay-floor-button-curent-floor",
  fontWeight: "bold"
});

const cssClose = css({
  label: "overlay-close",
  ...mixins.buttonReset,
  ...mixins.focusOutline,
  position: "absolute",
  top: 0,
  right: 0,
  padding: 4,
  width: 32,
  height: 32,
  fontSize: 11,
  textAlign: "center",
  margin: 10,
  background: theme.white,
  color: theme.textColor,
  borderRadius: "100%",
  fontWeight: "bold",
  boxShadow: "0 0 1px rgba(0, 0, 0, 0.8)",
  "&:hover": {
    background: theme.buttonHoverColor,
    boxShadow: "0 0 3px rgba(0, 0, 0, 0.8)"
  }
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
  <div className={cx(cssOverlay, "meridian-overlay")}>
    <button
      className={cx(cssClose, "meridian-overlay-close")}
      onClick={closeFloorOverlay}
    >
      <svg viewBox="0 0 36 36">
        <path d="M19.41 18l6.36-6.36a1 1 0 0 0-1.41-1.41L18 16.59l-6.36-6.36a1 1 0 0 0-1.41 1.41L16.59 18l-6.36 6.36a1 1 0 1 0 1.41 1.41L18 19.41l6.36 6.36a1 1 0 0 0 1.41-1.41z" />
      </svg>
    </button>
    <div className={cx(cssOverlayContent, "meridian-overlay-content")}>
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
  </div>
);

FloorOverlay.propTypes = {
  currentFloorID: PropTypes.string.isRequired,
  floorsByBuilding: PropTypes.object.isRequired,
  selectFloorByID: PropTypes.func.isRequired,
  closeFloorOverlay: PropTypes.func.isRequired
};

export default FloorOverlay;
