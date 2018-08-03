import { h } from "preact";
import PropTypes from "prop-types";
import { css, theme, mixins, cx } from "./style";

const cssZoomControls = css(mixins.shadow, mixins.rounded, {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
  right: 15,
  bottom: 15
});

const cssZoomButton = css(
  mixins.buttonReset,
  mixins.focusRing,
  mixins.rounded,
  {
    padding: 4,
    width: 40,
    height: 40,
    border: 0,
    fontSize: 20,
    fontWeight: 200,
    fill: theme.brandBrightBlue,
    background: "white",
    "&:hover": { background: theme.buttonHoverColor },
    "&:active": { background: theme.buttonActiveColor }
  }
);

const cssZoomButtonIn = css(cssZoomButton, {
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderBottom: `1px solid ${theme.buttonSeparatorColor}`
});

const cssZoomButtonOut = css(cssZoomButton, {
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
});

const ZoomButton = ({ onClick, dir }) => {
  if (dir === "in") {
    return (
      <button
        className={cx(
          cssZoomButtonIn,
          "meridian-zoom-button",
          "meridian-zoom-button-in"
        )}
        onClick={onClick}
      >
        <svg viewBox="0 0 36 36">
          <path d="M26 17h-7v-7a1 1 0 0 0-2 0v7h-7a1 1 0 0 0 0 2h7v7a1 1 0 0 0 2 0v-7h7a1 1 0 0 0 0-2" />
        </svg>
      </button>
    );
  } else {
    return (
      <button
        className={cx(
          cssZoomButtonOut,
          "meridian-zoom-button",
          "meridian-zoom-button-out"
        )}
        onClick={onClick}
      >
        <svg viewBox="0 0 36 36">
          <path d="M26 19H10a1 1 0 0 1 0-2h16a1 1 0 0 1 0 2" />
        </svg>
      </button>
    );
  }
};

ZoomButton.propTypes = {
  zoomD3: PropTypes.node,
  dir: PropTypes.oneOf(["in", "out"])
};

const ZoomControls = ({ onZoomIn, onZoomOut }) => (
  <div className={cx(cssZoomControls, "meridian-zoom-controls")}>
    <ZoomButton onClick={onZoomIn} dir="in" />
    <ZoomButton onClick={onZoomOut} dir="out" />
  </div>
);

ZoomControls.propTypes = {
  onZoomIn: PropTypes.func,
  onZoomOut: PropTypes.func
};

export default ZoomControls;
