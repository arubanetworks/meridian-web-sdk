import { h } from "preact";
import PropTypes from "prop-types";

import { css, theme, mixins, cx } from "./style";

const cssOverlay = css({
  label: "overlay",
  ...mixins.shadow,
  ...mixins.rounded,
  overflow: "hidden",
  background: theme.white,
  fill: "#000",
  position: "absolute",
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

const cssClose = css({
  label: "close",
  ...mixins.buttonReset,
  position: "absolute",
  top: 0,
  right: 0,
  width: 26,
  height: 26,
  fontSize: 11,
  textAlign: "center",
  margin: 10,
  background: "rgba(255, 255, 255, 0.5)",
  color: theme.black,
  borderRadius: "100%",
  fontWeight: "bold",
  boxShadow: "0 0 1px rgba(0, 0, 0, 0.8)",
  "&:focus": { outline: "none" },
  "&:hover": {
    background: theme.white,
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
  // Uncomment for tons of fake data :)
  // return [...keys, ...keys, ...keys];
};

const cssOverlayBuildingName = css({
  label: "overlay-building-name",
  fontWeight: "bold"
});

const FloorOverlay = ({
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
            >
              {floor.name}
            </button>
          ))}
        </div>
      ))}
    </div>
  </div>
);

FloorOverlay.propTypes = {
  floorsByBuilding: PropTypes.object,
  selectFloorByID: PropTypes.func,
  closeFloorOverlay: PropTypes.func
};

export default FloorOverlay;
