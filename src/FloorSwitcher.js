import { h } from "preact";
import PropTypes from "prop-types";
import { css, theme, mixins, cx } from "./style";

const cssFloorSwitcher = css({
  label: "floors-button",
  ...mixins.buttonReset,
  ...mixins.shadow,
  ...mixins.rounded,
  background: "white",
  position: "absolute",
  zIndex: 1,
  right: 15,
  top: 15,
  width: 32,
  height: 32,
  border: 0,
  fontSize: 20,
  fontWeight: 200,
  fill: theme.brandBrightBlue,
  "&:hover": { background: theme.buttonHoverColor },
  "&:active": { background: theme.buttonActiveColor },
  "&:focus": { outline: "none" }
});

// TODO: Actually allow switching floors
const FloorSwitcher = ({ floorsByBuilding }) => (
  <button className={cx(cssFloorSwitcher, "meridian-floors-button")}>
    <svg viewBox="0 0 36 36">
      <path d="M28.4 14.09a1.84 1.84 0 0 0-.62-.39l-8.48-3.33a3.61 3.61 0 0 0-1.3-.22 3.56 3.56 0 0 0-1.3.22L8.22 13.7a1.83 1.83 0 0 0-.62.39 1.24 1.24 0 0 0 0 1.82 1.85 1.85 0 0 0 .62.39l8.48 3.34a3.92 3.92 0 0 0 2.59 0l8.48-3.34a1.86 1.86 0 0 0 .62-.39 1.24 1.24 0 0 0 0-1.82m-9.83 3.68a2 2 0 0 1-1.13 0l-7-2.77 7-2.77a2 2 0 0 1 1.13 0l7 2.77zm9.83 2.32a1.24 1.24 0 0 1 0 1.82 1.86 1.86 0 0 1-.62.39l-8.47 3.33a3.92 3.92 0 0 1-2.59 0L8.22 22.3a1.85 1.85 0 0 1-.62-.39 1.24 1.24 0 0 1 0-1.82 1.83 1.83 0 0 1 .62-.39L10 19l2.73 1.08-2.34.92 7 2.77a2 2 0 0 0 1.13 0l7-2.77-2.35-.92L26 19l1.79.7a1.84 1.84 0 0 1 .62.39" />
    </svg>{" "}
  </button>
);

FloorSwitcher.propTypes = {
  floorsByBuilding: PropTypes.object
};

export default FloorSwitcher;
