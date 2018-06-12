import { h } from "preact";
import PropTypes from "prop-types";
import { css, theme, mixins, cx } from "./style";

const cssZoomButtons = css({
  ...mixins.shadow,
  ...mixins.rounded,
  background: "white",
  overflow: "hidden",
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
  right: 10,
  top: 10
});

const styleZoomButton = {
  ...mixins.buttonReset,
  width: 32,
  height: 32,
  border: 0,
  borderRadius: 0,
  fontSize: 20,
  fontWeight: 200,
  color: theme.brandBlue,
  "&:hover": { background: theme.buttonHoverColor },
  "&:active": { background: theme.buttonActiveColor },
  "&:focus": { outline: "none" }
};

const cssZoomButtonIn = css({
  ...styleZoomButton,
  borderBottom: `1px solid ${theme.buttonSeparatorColor}`
});

const cssZoomButtonOut = css({
  ...styleZoomButton
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
        +
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
        &minus;
      </button>
    );
  }
};

ZoomButton.propTypes = {
  zoomD3: PropTypes.node,
  dir: PropTypes.oneOf(["in", "out"])
};

const ZoomButtons = ({ onZoomIn, onZoomOut }) => (
  <div className={cx(cssZoomButtons, "meridian-zoom-buttons-container")}>
    <ZoomButton onClick={onZoomIn} dir="in" />
    <ZoomButton onClick={onZoomOut} dir="out" />
  </div>
);

ZoomButtons.propTypes = {
  onZoomIn: PropTypes.func,
  onZoomOut: PropTypes.func
};

export default ZoomButtons;
