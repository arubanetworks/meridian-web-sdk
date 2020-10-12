/** @jsx h */

/**
 * @internal
 * @packageDocumentation
 */

import { h } from "preact";
import PropTypes from "prop-types";

import { css, theme, mixins, cx } from "./style";

const cssFloorAndTagControls = css({
  label: "floor-and-tag-controls",
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  zIndex: 1,
  right: 15,
  top: 15
});

const cssControl = css(
  mixins.buttonReset,
  mixins.shadow,
  mixins.rounded,
  mixins.buttonHoverActive,
  mixins.focusRing,
  {
    label: "control",
    cursor: "pointer",
    background: "white",
    padding: 4,
    width: 40,
    height: 40,
    border: 0,
    fontSize: 20,
    fontWeight: 200,
    fill: theme.brandBrightBlue
  }
);

const cssControlNotFirst = css(cssControl, {
  marginTop: 10
});

const FloorAndTagControls = ({
  toggleFloorOverlay,
  toggleTagListOverlay,
  showFloors,
  showTagList
}) => (
  <div className={cssFloorAndTagControls}>
    {showTagList ? (
      <button
        className={cx("meridian-tag-control", cssControl)}
        data-testid="meridian--private--tag-control"
        onClick={() => {
          toggleTagListOverlay({ open: true });
        }}
      >
        {/* TODO: Can we get this SVG fixed up? */}
        <svg viewBox="-8 -10 36 36">
          <path d="M2 4C0.9 4 0 3.1 0 2C0 0.9 0.9 0 2 0C3.1 0 4 0.9 4 2C4 3.1 3.1 4 2 4ZM4 8C4 6.9 3.1 6 2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8ZM4 14C4 12.9 3.1 12 2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14ZM20 2C20 1.4 19.6 1 19 1H8C7.4 1 7 1.4 7 2C7 2.6 7.4 3 8 3H19C19.6 3 20 2.6 20 2ZM20 8C20 7.4 19.6 7 19 7H8C7.4 7 7 7.4 7 8C7 8.6 7.4 9 8 9H19C19.6 9 20 8.6 20 8ZM20 14C20 13.4 19.6 13 19 13H8C7.4 13 7 13.4 7 14C7 14.6 7.4 15 8 15H19C19.6 15 20 14.6 20 14Z" />
        </svg>
      </button>
    ) : null}
    {showFloors ? (
      <button
        className={cx(
          "meridian-floor-control",
          showFloors && showTagList ? cssControlNotFirst : cssControl
        )}
        data-testid="meridian--private--floor-control"
        onClick={() => {
          toggleFloorOverlay({ open: true });
        }}
      >
        <svg viewBox="0 0 36 36">
          <path d="M28.4 14.09a1.84 1.84 0 0 0-.62-.39l-8.48-3.33a3.61 3.61 0 0 0-1.3-.22 3.56 3.56 0 0 0-1.3.22L8.22 13.7a1.83 1.83 0 0 0-.62.39 1.24 1.24 0 0 0 0 1.82 1.85 1.85 0 0 0 .62.39l8.48 3.34a3.92 3.92 0 0 0 2.59 0l8.48-3.34a1.86 1.86 0 0 0 .62-.39 1.24 1.24 0 0 0 0-1.82m-9.83 3.68a2 2 0 0 1-1.13 0l-7-2.77 7-2.77a2 2 0 0 1 1.13 0l7 2.77zm9.83 2.32a1.24 1.24 0 0 1 0 1.82 1.86 1.86 0 0 1-.62.39l-8.47 3.33a3.92 3.92 0 0 1-2.59 0L8.22 22.3a1.85 1.85 0 0 1-.62-.39 1.24 1.24 0 0 1 0-1.82 1.83 1.83 0 0 1 .62-.39L10 19l2.73 1.08-2.34.92 7 2.77a2 2 0 0 0 1.13 0l7-2.77-2.35-.92L26 19l1.79.7a1.84 1.84 0 0 1 .62.39" />
        </svg>
      </button>
    ) : null}
  </div>
);

FloorAndTagControls.propTypes = {
  showFloors: PropTypes.bool.isRequired,
  showTagList: PropTypes.bool.isRequired,
  toggleFloorOverlay: PropTypes.func.isRequired,
  toggleTagListOverlay: PropTypes.func.isRequired
};

export default FloorAndTagControls;
